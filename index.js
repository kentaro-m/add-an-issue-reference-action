class IssueReferenceCreator {
  constructor (tools) {
    this.tools = tools
    this.args = JSON.parse(this.tools.arguments['_'][0])
  }

  async go () {
    const eventJSON = this.tools.context.payload

    // Runs pull_request.opened event only
    if (eventJSON.action !== 'opened') {
      return
    }

    // Get the issue number based on branch name
    const branchName = eventJSON.pull_request.head.ref
    const pattern = new RegExp(`${this.args.branch}-([0-9]+)`);
    const issueNumber = this.getIssueNumber(branchName, pattern)

    // Skip process to add an issue reference to a pull request
    if (issueNumber === 0) {
      return
    }

    // Create the issue comment to the pull request
    const issueData = await this.tools.github.issues.get(
      this.tools.context.issue({ number: issueNumber })
    )

    const issueTitle = issueData.data.title
    const referenceComment = `Related Issue: #${issueNumber} ${issueTitle}`

    const response = await this.tools.github.issues.createComment(
      this.tools.context.issue({ body: referenceComment })
    )

    const result = {
      issueNumber,
      prNumber: eventJSON.number,
      url: response.data.html_url
    }

    return result
  }

  /**
   * @description Gets the issue number based on branch name
   * @param branchName
   * @param pattern
   * @returns {number}
   */
  getIssueNumber(branchName, pattern) {
    const result = branchName.match(pattern)

    if (result !== null) {
      return parseInt(result[1])
    }

    return 0
  }
}

module.exports = IssueReferenceCreator
