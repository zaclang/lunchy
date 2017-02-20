import _ from 'lodash'


class SlackFormatter {

  constructor() {
    this.colors = ['#870e0e', '#d08b05', '#ffe900', '#1e7e51', '#805621'];
    this.currentColorIndex = 0;
  }


  formatMenus(menus) {
    if (!menus || !menus.length) {
      return [{
        text: 'There are no daily menus online yet.',
        mrkdwn_in: ['text']
      }]
    }

    let attachments = menus
      .filter(({dishes}) => dishes && dishes.length)
      .map(({restaurant, name, dishes}) => this._menuToAttachment(dishes, name, restaurant.menu_url || restaurant.url, restaurant.thumb));

    const emptyMenusRestaurants = menus.filter(({dishes}) => !dishes || !dishes.length).map(({name, restaurant}) => `<${restaurant.menu_url}|${name}>`);

    console.log('Menus:', attachments.length, 'mapped,', emptyMenusRestaurants.length, 'empty,')

    if (emptyMenusRestaurants.length > 0) {
      attachments = [...attachments , {
        text: ':knife_fork_plate: *' + emptyMenusRestaurants.join(', ') + '* has no daily menu available!',
        mrkdwn_in: ['text'],
      }]
    }

    return attachments;
  }


  _menuToAttachment(dishes, restaurantName = '', restaurantUrl = '', restaurantThumb = '') {
    let list = dishes
      .map(({dish}) => {
        return {
          name:  _.trim(dish.name).replace(/\s+/g, ' '),
          price: _.trim(dish.price)
        }
      })
      .map(({name, price}) => `${name} *${price}*`);
    return {
      title: restaurantName,
      text: list.join('\n'),
      title_link: restaurantUrl,
      thumb_url: restaurantThumb,
      //pretext:  = '',
      mrkdwn_in: ['text', 'pretext'],
      color: this._getNextColor()
    }
  }

  _getNextColor() {
    const color = this.colors[this.currentColorIndex];
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length
    return color;
  }

}

export default new SlackFormatter();
