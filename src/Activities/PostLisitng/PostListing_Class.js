import React, {Component} from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';

// screen size
const {width, height} = Dimensions.get('window');

export default class AllBeersScreen extends Component {
  state = {
    data: [],
    page: 1,
    loading: true,
    loadingMore: false,
    filtering: false,
    refreshing: false,
    error: null,
  };

  componentDidMount() {
    this.fetchAlldata();
  }

  fetchAlldata = () => {
    const {page} = this.state;
    //https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0
    const URL = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0`;

    

    fetch(URL)
      .then((response) => response.json())
      .then((response) => {
        console.warn('response', response);
        let postArray = response.hits;
        this.setState((prevState, nextProps) => ({
          data:
            page === 1
              ? Array.from(postArray)
              : [...this.state.data, ...postArray],
          loading: false,
          loadingMore: false,
          refreshing: false,
        }));
      })
      .catch((error) => {
        this.setState({error, loading: false});
      });
  };

  _handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.fetchAlldata();
      },
    );
  };

  _handleLoadMore = () => {
    this.setState(
      (prevState, nextProps) => ({
        page: prevState.page + 1,
        loadingMore: true,
      }),
      () => {
        this.fetchAlldata();
      },
    );
  };

  _renderFooter = () => {
    if (!this.state.loadingMore) return null;
    return (
      <View
        style={{
          position: 'relative',
          width: width,
          height: height,
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: 'pink',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({item}) => (
          <View
            style={{
              marginTop: 25,
              width: '50%',
            }}>
            <Text>{item.title} </Text>
          </View>
        )}
        keyExtractor={(item) => item.created_at.toString()}
        ListFooterComponent={this._renderFooter}
        onRefresh={this._handleRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this._handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
      />
    );
  }
}
