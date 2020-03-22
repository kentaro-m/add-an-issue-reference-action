import * as core from '@actions/core'
import * as github from '@actions/github'
import {getIssueNumber} from './utils'

async function run(): Promise<void> {
  try {
    // Get the issue number based on branch name
    const branchName = github.context.payload.pull_request?.head.ref
    const branchPrefix = core.getInput('branch-prefix', {required: true})
    const pattern = new RegExp(`${branchPrefix}([0-9]+)`)

    const issueNumber = getIssueNumber(branchName, pattern)

    // Skip process to add an issue reference to a pull request
    if (issueNumber === 0) {
      core.info('Skiped process to add an issue reference to a pull request.')
      return
    }

    const token = core.getInput('repo-token', {required: true})
    const githubAPI = new github.GitHub(token)

    const {repo, issue} = github.context

    const issueData = await githubAPI.issues.get({
      owner: repo.owner,
      repo: repo.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: issueNumber
    })

    const issueTitle = issueData.data.title
    const referenceComment = `Related Issue: #${issueNumber} ${issueTitle}`

    const response = await githubAPI.issues.createComment({
      owner: repo.owner,
      repo: repo.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: issue.number,
      body: referenceComment
    })

    core.info(
      `Added issue #${issueNumber} reference to pull request #${issue.number}.\n${response.data.html_url}`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
