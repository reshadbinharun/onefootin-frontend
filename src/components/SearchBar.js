import React, { Component } from 'react'
import { Search, Grid} from 'semantic-ui-react'

export default class SearchBar extends Component {
  render() {
    return (
      <Grid>
        <Grid.Column width={8}>
          <Search 
            open={false}
            onSearchChange={this.props.onSearchMode}
            placeholder='Search by name, location, etc...'
            value={this.props.searchValue}
          />
        </Grid.Column>
      </Grid>
    )
  }
}