import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'A cool item',
  price: 4000,
  description: 'This is a cool item',
  image: 'dog.jpg',
  largeImage: 'large-dog.jpg',
};

describe('<Item/>', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  // it('renders the price tag and title properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const PriceTag = wrapper.find('PriceTag');
  //   // console.log(wrapper.debug());
  //   // console.log(PriceTag.children().text);
  //   expect(PriceTag.children().text()).toBe('$50');
  //   expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  // });

  // it('renders and image properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const img = wrapper.find('img');
  //   expect(img.props().src).toBe(fakeItem.image);
  //   expect(img.props().alt).toBe(fakeItem.title);
  // });

  // it('renders out the buttons properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   console.log(wrapper.debug());
  //   const buttonList = wrapper.find('.buttonList');
  //   expect(buttonList.children()).toHaveLength(3);
  //   expect(buttonList.find('Link')).toHaveLength(1);
  //   expect(buttonList.find('AddToCart').exists()).toBe(true);
  //   expect(buttonList.find('DeleteItem').exists()).toBe(true);
  //   // expect(buttonList.find('AddToCart')).toBeTruthy();
  //   // console.log(buttonList.children());
  // });
});
