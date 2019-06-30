import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

export default  class ImageCard extends React.Component {
  render() {
    const {name, imageLink} = this.props;
    return (  
    <Card>
      <Image size='large' src={imageLink} />
      <Card.Content>
        <Card.Header>{name}</Card.Header>
      </Card.Content>
      <Card.Content extra>
          <Icon name='user' />
      </Card.Content>
    </Card>
    )
  }
}