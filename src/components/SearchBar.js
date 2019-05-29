import React, { Component } from 'react'
import { Search, Grid} from 'semantic-ui-react'

export default class SearchBar extends Component {
  render() {
    return (
      <Grid>
        <Grid.Column width={6}>
          <Search 
          open={false}
          onSearchChange={this.props.onSearchMode}
          />
        </Grid.Column>
      </Grid>
    )
  }
}