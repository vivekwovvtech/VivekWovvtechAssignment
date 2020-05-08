import React, {useState, useEffect} from 'react';
import {TextInput, View, FlatList} from 'react-native';
import {Container, Button, Fab, Icon, ActionSheet, Text} from 'native-base';
import PostCard from './PostLisitng/Postcard';

const FLATLIST_INITIAL_NUM_TO_RENDER = 10;
var BUTTONS = ['Filter by title', 'Filter by created at', 'Reset'];
var CANCEL_INDEX = 2;

let timerInstance;
let dataStore = [];
let page = 0;
let filteredData = [];

const PostListing = ({params}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [seachText, setSearchText] = useState('');
  const [displayArray, setDisplayArray] = useState([]);
  const [isFilterEnabled, setFilterEnabled] = useState(false);
  const [isCreatedDateFilterEnabled, setCreatedDateFilterEnabled] = useState(
    false,
  );
  const [isSearchEnabled, setSearchEnabled] = useState(false);

  const getPostData = async (page) => {
      //page is variable
    console.log('calling api', page);
    fetch(
      `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`,
    )
      .then((response) => response.json())
      .then((json) => {
        let tempPostArray = json.hits;
        dataStore = [...dataStore, ...tempPostArray];

        setIsLoading(false);
        if (page === 0) {
          setDisplayArray(dataStore);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setError('No Records Found');
      });
  };

  const refreshData = () => {
    clearTimeout(timerInstance);
    dataStore = [];
    page = 0;
    setIsLoading(true);
    getPostData(page++);
    timerInstance = setInterval(() => {
      getPostData(page++);
    }, 10000);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLoadMore = () => {
    let tempArray = [];
    if (isFilterEnabled || isCreatedDateFilterEnabled || isSearchEnabled) {
      console.log('Here in Fil-> ');

      tempArray = filteredData.slice(
        displayArray.length,
        displayArray.length + 10,
      );
    } else {
      console.log('Here in Nor-> ');
      tempArray = dataStore.slice(
        displayArray.length,
        displayArray.length + 10,
      );
    }
    setDisplayArray([...displayArray, ...tempArray]);
  };

  useEffect(() => {
    handleLoadMore();
  }, [isFilterEnabled, isCreatedDateFilterEnabled, isSearchEnabled]);

  const renderListItem = ({item, index}) => {
    return <PostCard {...item} />;
  };

  const resetList = () => {
    setDisplayArray([]);
    setFilterEnabled(false);
    setCreatedDateFilterEnabled(false);
    setSearchEnabled(false);
    setSearchText('');
  };

  const filterByTitle = () => {
    if (!isFilterEnabled) {
      filteredData = [...dataStore];
      filteredData = filteredData.sort(function (a, b) {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      setDisplayArray([]);
      setFilterEnabled(true);
      setCreatedDateFilterEnabled(false);
      setSearchEnabled(false);
    }
  };

  const filterByCreatedDate = () => {
    if (!isCreatedDateFilterEnabled) {
      filteredData = [...dataStore];
      filteredData = filteredData.sort(function (a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setDisplayArray([]);
      setCreatedDateFilterEnabled(true);
      setFilterEnabled(false);
      setSearchEnabled(false);
    }
  };

  const filterByUrlAndAuthor = () => {
    if (seachText === '') {
      return resetList();
    }
    if (!isSearchEnabled) {
      filteredData = [...dataStore];
      filteredData = filteredData.filter((item) => {
        if (
          item.url &&
          item.url.toLowerCase().includes(seachText.toLowerCase())
        ) {
          return true;
        } else if (
          item.author &&
          item.author.toLowerCase().includes(seachText.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });

      console.log('filteredData', filteredData.length);
      setDisplayArray([]);
      setSearchEnabled(true);
    }
  };

  const onSearch = () => {
    if (seachText) {
      if (isSearchEnabled) {
        console.log('celled  resetList');
        resetList();
      } else {
        console.log('celled  filterByUrlAndAuthor');
        filterByUrlAndAuthor();
      }
    }
  };

  return (
    <Container style={{flex: 1, paddingHorizontal: '4%'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'light-gray',
            width: '75%',
            borderRadius: 10,
          }}
          placeholder=" Search by Url or Author"
          onChangeText={(val) => setSearchText(val)}
          value={seachText}
          onSubmitEditing={onSearch}
        />
        <Button onPress={onSearch}>
          <Text>{isSearchEnabled ? 'CLEAR' : 'SEARCH'}</Text>
        </Button>
      </View>
      <Button
        style={{
          height: 30,
          width: 100,
          alignSelf: 'center',
          marginVertical: 10,
        }}
        onPress={refreshData}>
        <Text>REFRESH</Text>
      </Button>
      <FlatList
        data={displayArray}
        extraData={displayArray}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={FLATLIST_INITIAL_NUM_TO_RENDER}
        refreshing={isLoading}
        onRefresh={refreshData}
      />
      <Fab
        direction="up"
        containerStyle={{}}
        style={{backgroundColor: '#5067FF'}}
        position="bottomRight"
        onPress={() =>
          ActionSheet.show(
            {
              options: BUTTONS,
              cancelButtonIndex: CANCEL_INDEX,
              // destructiveButtonIndex: DESTRUCTIVE_INDEX,
              title: 'Select filter to apply',
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                filterByTitle();
              } else if (buttonIndex === 1) {
                filterByCreatedDate();
              } else {
                resetList();
              }
            },
          )
        }>
        <Icon type="FontAwesome" name="filter" />
      </Fab>
    </Container>
  );
};

export default PostListing;
