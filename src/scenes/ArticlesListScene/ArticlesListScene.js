/* Dependencies */
import React, {
  Component
} from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import {
  MKSpinner,
  MKButton,
  MKColor
} from 'react-native-material-kit';
import { connect } from 'react-redux';

/* Components */
import NavBar from './components/NavBar';
import ArticlesList from './components/ArticlesList';
import { loadArticles, resetArticlesError } from '../../redux/actions/ArticlesActions';

class ArticlesListScene extends Component {
  componentWillMount() {
    return this._loadMoreArticles();
  }
  
  render () {
    let renderSpinner = this._renderSpinner.bind(this);
    let renderError = this._renderError.bind(this);
    let renderArticlesList = this._renderArticlesList.bind(this);
    let handleOnLoadMore = this._handleOnLoadMore.bind(this);

    return <View style={styles.root}>
      <NavBar/>
      {renderArticlesList()}
      {renderSpinner()}
      {renderError()}
    </View>
  }

  _loadMoreArticles () {
    let {page_number, page_count} = this.props.articles_meta;

    if (page_count > page_number) {
      this.props.dispatch(loadArticles(page_number+1))
    }
  }

  _handleOnLoadMore () {
    let {fetching} = this.props;

    if (fetching == false) {
      this._loadMoreArticles();
    }
  }

  _renderSpinner () {
    let {fetching} = this.props;

    if (fetching) {
      return <View style={styles.spinnerContainer}>
        <MKSpinner style={styles.spinner} />
      </View>
    }
  }

  _renderError () {
    let {errorMessage, fetching} = this.props;
    let handlePressRetryButton = this._handleOnLoadMore.bind(this);

    if (errorMessage && fetching == false) {
      return <View style={styles.errorCointainer}>
        <Text>{errorMessage}</Text>
        <MKButton style={styles.retryButton} onPress={handlePressRetryButton}>
          <Text style={styles.retryButtonText}>REINTENTAR</Text>
        </MKButton>
      </View>
    }
  }

  _renderArticlesList () {
    let {articles} = this.props;
    let handleOnLoadMore = this._handleOnLoadMore.bind(this);

    if (articles.length > 0) {
      return <ArticlesList articles={articles} onLoadMore={handleOnLoadMore} />
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },

  spinner: {
    width: 32,
    height: 32
  },

  spinnerContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center'
  },

  errorCointainer: {
    padding: 12,
    alignItems: 'center'
  },

  retryButton: {
    height: 36,
    marginTop: 8,
    paddingRight: 8,
    paddingLeft: 8,
    justifyContent: 'center'
  },

  retryButtonText: {
    color: MKColor.Blue,
    fontWeight: 'bold'
  }
});

const mapStateToProps = (state) => {
  let articlesIds = state.articles.get('ids');
  let articles = [];

  articlesIds.forEach(articleId => {
    let article = state.entities.getIn(['articles', articleId.toString()]);

    if (article) {
      articles.push(article.toJS());
    }
  })

  return {
    articles: articles,
    articles_meta: state.articles.get('meta').toJS(),
    fetching: state.articles.get('fetching'),
    errorMessage: state.articles.get('errorMessage')
  };
};

ArticlesListScene = connect(
  mapStateToProps
)(ArticlesListScene);

export default ArticlesListScene;
