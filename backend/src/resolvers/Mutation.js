const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const util = require('util');

// custom imports
const { transport } = require('../mail');
const { makeANiceEmail } = require('../email-templates/black-friday');
const { hasPermission } = require('../utils');

const setCookieWithToken = (ctx, token) => {
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
  });
};

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that');
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // this is how we create a relationship between the Item and teh User
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );
    // console.log(item);

    return item;
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    // throw new Error('You do not have permissions to delete this item');
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title user { id }}`);
    // 2. Check if they own that item, or have permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    );

    if (!ownsItem && !hasPermissions) {
      throw new Error("You don't have permission to do that");
    }

    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // make sure all emails are lowercase
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the jwt as a cookie on the response
    setCookieWithToken(ctx, token);
    // User created and we have a token
    // now return the user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. Check if there is an email with that user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password!');
    }
    // 3. Generate the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    setCookieWithToken(ctx, token);
    // 5. Return the user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Live long and prosper' };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`no such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytes = util.promisify(crypto.randomBytes);
    const resetToken = (await randomBytes(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    // console.log(res);
    // 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: 'howley.phil@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
        \n\n
        <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });
    // 4. Return the message
    return { message: 'Thanks' };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. Check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error(`You're passwords don't match`);
    }
    // 2. Check if its a legit reset token
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    // 3. Check if token is expired
    if (!user) {
      throw new Error('This token is either invalid or expired');
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { password, resetToken: null, resetTokenExpiry: null },
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    setCookieWithToken(ctx, token);
    // 8. Return the new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    // 2. Query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info
    );
    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // 4. Update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    // 1. Make suer they are signed in
    const userId = ctx.request.userId;
    // same line above could be destructured like:
    // const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in');
    }
    // 2. Query the users current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId }, // ID of user we are passing
        item: { id: args.id }, // ID of item we will be passing
      },
    });
    // 3. Check if that item is already in their cart and increment by 1 if it is
    if (existingCartItem) {
      console.log('This item is already in your cart');
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info
      );
    }
    // 4. If its not, create a fresh CartItem for that user!
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId },
          },
          item: {
            connect: { id: args.id },
          },
        },
      },
      info
    );
  },
};

module.exports = Mutations;
