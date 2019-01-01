import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Router from 'next/router';

// graphql
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

// libs
import formatMoney from '../lib/formatMoney';

// custom components
import ErrorMessage from './ErrorMessage';

// custom styles
import Form from './styles/Form';

// GraphQL queries
export const CREATE_ITEM_MUTATION = gql`
  mutation createGreatItem($title: String!, $description: String!, $image: String, $largeImage: String, $price: Int) {
    createItem(title: $title, description: $description, image: $image, largeImage: $largeImage, price: $price) {
      id
      title
      description
      image
      largeImage
      price
    }
  }
`;

class CreateItem extends Component {
  // static propTypes = {
  //   prop: PropTypes,
  // };

  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: '',
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val,
    });
  };

  handleSubmit = async (event, createItem) => {
    // stop the from from submitting
    event.preventDefault();
    // call the mutation
    const res = await createItem();
    // change them to the single item page
    console.log(res);
    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id },
    });
  };

  // images
  uploadFile = async event => {
    const { files } = event.target;
    // console.log('uploading file');
    // pull files from selection
    // user FormData API which is part of JavaScript
    //  to prep all the data
    const data = new FormData();
    // Append the file to the first field user selected
    data.append('file', files[0]);
    // Add preset that cloudinary needs
    data.append('upload_preset', 'buystuff');

    // Hit cloudinary API
    // Don't forget to make this an async function
    // Since we are awaiting here
    // The URL ends with the Cloudinary cloud name (you can edit this)
    const res = await fetch('https://api.cloudinary.com/v1_1/piplearns/image/upload', {
      method: 'POST',
      body: data,
    });
    // convert the response we get into JSON
    const file = await res.json();
    // let's see what our file data looks like
    console.log(file);
    //
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  render() {
    const { title, description, image, largeImage, price } = this.state;
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={{ title, description, image, largeImage, price }}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={e => this.handleSubmit(e, createItem)}>
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  required
                  onChange={this.uploadFile}
                />
                {image && <img width="200" src={image} alt="Upload Preview" />}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter A Description"
                  required
                  value={description}
                  onChange={this.handleChange}
                />
              </label>
            </fieldset>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
