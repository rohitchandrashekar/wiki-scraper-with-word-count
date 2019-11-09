const fs = require('fs');
const requestPromise = require('request-promise');
import * as cheerio from 'cheerio';
const url = 'https://en.wikipedia.org/wiki/India';

//list of stop words
const stopwords = [
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'it',
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
  'and',
  'but',
  'if',
  'or',
  'because',
  'as',
  'until',
  'while',
  'of',
  'at',
  'by',
  'for',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'in',
  'out',
  'on',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'can',
  'will',
  'just',
  'don',
  'should',
  'now'
];

async function initScraping() {
  try {
        //get data from the wikipedia page for india
        let wikiResponse = await requestPromise(url);
        let $ = cheerio.load(wikiResponse);
        let wikiContentData = $('.mw-parser-output > p').text();
        //remove next line characters from the string
        wikiContentData = wikiContentData.replace(/\r?\n|\r/g, ' ');
        //remove special characters from the string
        wikiContentData = wikiContentData.replace(
          /[&\/\\#,+(){}$~%.'":;*?<>{}[\]]/g,
          ''
        );
        //discarding stopwords from the string
        let actualWikiContentData = discardStopWords(wikiContentData);
        //counting the number of times a string is occuring in a word
        let wordCount = actualWikiContentData.reduce((acc, curr) => {
            
            if(curr !== ''){
            if (typeof acc[curr] == 'undefined') {
            acc[curr] = 1;
          } else {
            acc[curr] += 1;
          }
        }
          return acc;
        }, {});
        //sorting the object to get the highest count first
        let keysSorted = Object.keys(wordCount)
          .sort((a, b) => wordCount[b] - wordCount[a]);
        keysSorted.slice(0,5).forEach(element => 
            console.log(`the word ${element} occurs ${wordCount[element]} times`)
        );
      } catch (error) {
    console.error(
      `wikipedia scraper :: error fetching article from wikipedia :: ${error}`
    );
  }
}

//function to discard stop words
function discardStopWords(str) {
  const res = [];
  const allWords = str.split(' ');
  for (let i = 0; i < allWords.length; i++) {
    if (!stopwords.includes(allWords[i].toLowerCase())) {
      res.push(allWords[i]);
    }
  }
  return res;
}

initScraping()
