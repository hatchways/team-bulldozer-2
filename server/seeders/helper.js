const fetch = require('node-fetch');

const BASE_URL = 'https://leetcode.com';
const GRAPH_BASE_URL = `${BASE_URL}/graphql`;

const graphql = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      titleSlug
      content
      difficulty
      likes
      dislikes
      isLiked
      similarQuestions
      topicTags {
        name
        slug
        translatedName
        __typename
      }
      codeSnippets {
        lang
        langSlug
        code
        __typename
      }
      stats
      hints
      solution {
        id
        canSeeDetail
        body
        __typename
      }
      status
      sampleTestCase
      metaData
      judgerAvailable
      judgeType
      mysqlSchemas
      enableRunCode
      enableTestMode
      enableDebugger
      envInfo
      libraryUrl
      __typename
    }
  }
`;

/**
 * Return an array of question slugs
 * 0:{difficulty: 2, slug: '4sum-ii'}
 * 1:{difficulty: 1, slug: 'fizz-buzz'}
 * 2:{difficulty: 2, slug: 'longest-substring-with-at-least-k-repeating-characters'}
 * 3:{difficulty: 1, slug: 'first-unique-character-in-a-string'}
 * 4:{difficulty: 2, slug: 'shuffle-an-array'}
 *  * @param {*} done
 */
function fetchTopQuestions(done) {
  fetch(`${BASE_URL}/api/problems/favorite_lists/top-interview-questions/`, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((body) => body.json())
    .then((data) => data.stat_status_pairs
      .map((s) => ({ difficulty: s.difficulty.level, slug: s.stat.question__title_slug })))
    .then((data) => done(null, data))
    .catch((err) => done(err));
}

function fetchQuestionDetails(titleSlug, done) {
  const body = {
    operationName: 'questionData',
    variables: {
      titleSlug,
    },
    query: graphql,
  };
  fetch(GRAPH_BASE_URL, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((body) => body.json())
    .then((data) => done(null, data.data.question))
    .catch((err) => done(err));
}

module.exports = {
  fetchTopQuestions,
  fetchQuestionDetails,
};

// DEMO:
// fetchTopQuestions(console.log);
// fetchQuestionDetails('4sum-ii', console.log);
// fetchQuestionDetails('insert-delete-getrandom-o1', console.log);
// fetchQuestionDetails('letter-combinations-of-a-phone-number', console.log);
