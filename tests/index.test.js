const IssueReferenceCreator = require('..')
const { Toolkit } = require('actions-toolkit')

describe('add-an-issue-reference-action', () => {
  let issueReferenceCreator
  let tools

  beforeEach(() => {
    tools = new Toolkit()
    tools.arguments = { '_': ['{\"branch\":\"issue\"}'] }
    tools.github = {
      issues: {
        createComment: jest.fn(() => {
          return { data: { html_url: 'https://github.com/kentaro-m/add-an-issue-reference-action/pull/10#issuecomment-459932800' } }
        }),
        get: jest.fn(() => {
          return { data: { title: 'Update README.md' } }
        })
      }
    }
    tools.context.payload = {
      action: 'opened',
      number: 10,
      pull_request: {
        head: {
          ref: 'issue-31'
        },
        title: 'Update README.md',
        number: 10
      },
      repository: {
        owner: {
          login: 'kentaro-m'
        },
        name: 'add-an-issue-reference-action'
      }
    }
    issueReferenceCreator = new IssueReferenceCreator(tools)
  })

  it('Adds an issue reference to a pull request', async () => {
    const result = await issueReferenceCreator.go()

    expect(result).toEqual({
      issueNumber: 31,
      prNumber: 10,
      url: 'https://github.com/kentaro-m/add-an-issue-reference-action/pull/10#issuecomment-459932800'
    })
  })

  it('Skips process if a branch name is not included a specified prefix', async () => {
    tools.context.payload.pull_request.head.ref = 'patch1'

    issueReferenceCreator = new IssueReferenceCreator(tools)

    const result = await issueReferenceCreator.go()

    expect(result).toBeUndefined()
  })

  it('Skips process if an event is not pull_request.opened', async () => {
    tools.context.payload.action = 'closed'

    issueReferenceCreator = new IssueReferenceCreator(tools)

    const result = await issueReferenceCreator.go()

    expect(result).toBeUndefined()
  })

  it('Gets the issue number based on branch name', () => {
    const branchName = 'issue-29'
    const pattern = /issue-([0-9]+)/

    const issueNumber = issueReferenceCreator.getIssueNumber(branchName, pattern)

    expect(issueNumber).toBe(29)
  })

  it('Gets number 0 if the branch name is a pattern not match', () => {
    const branchName = 'patch1'
    const pattern = /issue-([0-9]+)/

    const issueNumber = issueReferenceCreator.getIssueNumber(branchName, pattern)

    expect(issueNumber).toBe(0)
  })
})
