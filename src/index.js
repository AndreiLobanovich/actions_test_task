import { Octokit } from 'octokit';
import { subMonths } from 'date-fns';
import * as core from '@actions/core';


try {
  const token = process.env.GITHUB_TOKEN;
  const octokit = new Octokit({
    auth: token
  })
  const owner = core.getInput("owner");
  const repo = core.getInput("repository");
  const dateSince = core.getInput("dateSince");
  const sinceParam = dateSince ? new Date(dateSince) : subMonths(new Date(), 1);

  const issuesAndPRs = await octokit.paginate(
    octokit.rest.issues.listForRepo,
    {
      owner: owner,
      repo: repo,
      state: "all",
      per_page: 100
    }
  );

  const pullRequests = issuesAndPRs.filter(item => item.pull_request !== undefined);
  const issues = issuesAndPRs.filter(item => item.pull_request === undefined)

  const openIssues = issues.filter(issue => !issue.pull_request && issue.state === 'open' && new Date(issue.created_at) > sinceParam);
  const closedIssues = issues.filter(issue => !issue.pull_request && issue.state === 'closed' && new Date(issue.closed_at) > sinceParam);

  const openPRs = pullRequests.filter(pr => pr.state === 'open' && new Date(pr.created_at) > sinceParam);
  const closedPRs = pullRequests.filter(pr => pr.state === 'closed' && new Date(pr.closed_at) > sinceParam);

  core.info(`Total PRs: ${pullRequests.length}`);
  core.setOutput('totalPrs', pullRequests.length);

  core.info(`Open PRs: ${openPRs.length}`);
  core.setOutput('openPrs', openPRs.length);

  core.info(`Closed PRs: ${closedPRs.length}`);
  core.setOutput('closedPrs', closedPRs.length);

  core.info(`Total issues: ${issues.length}`);
  core.setOutput('totalIssues', issues.length);

  core.info(`Open issues: ${openIssues.length}`);
  core.setOutput('openIssues', openIssues.length);

  core.info(`Closed issues: ${closedIssues.length}`);
  core.setOutput('closedIssues', closedIssues.length);

} catch (error) {
  core.setFailed(error.message);
}