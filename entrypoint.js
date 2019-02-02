const IssueReferenceCreator = require('.')
const { Toolkit } = require('actions-toolkit')

const tools = new Toolkit()
const issueReferenceCreator = new IssueReferenceCreator(tools)

issueReferenceCreator.go()
  .then(result => {
    if (result) {
      console.log(`Added issue #${result.issueNumber} reference to pull request #${result.prNumber}.\n${result.url}`)
    } else {
      console.log('Skiped process to add an issue reference to a pull request.')
    }
  })
