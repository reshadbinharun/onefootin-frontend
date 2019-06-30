import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

export default  class ImageCard extends React.Component {
  render() {
    const {name, image} = this.props;
    return (  
    <Card>
      <Image size='large' src={image} />
      <Image size='large' src='https://onefootin-images.s3.amazonaws.com/user-1561934037471-lg.jpg' />
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