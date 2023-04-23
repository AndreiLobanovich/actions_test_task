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
  const timeAgo = parseInt(core.getInput("monthsAgo"));
  const sinceParam = timeAgo ? subMonths(new Date(), timeAgo) : subMonths(new Date(), 1);
  const [issues, pullRequests] = await Promise.all([
    octokit.rest.issues.listForRepo({ owner, repo, since: sinceParam }),
    octokit.rest.pulls.list({ owner, repo, state: 'all', sort: 'created', direction: 'desc', since: sinceParam.toISOString() }),
  ]);

  const openIssues = issues.data.filter(issue => !issue.pull_request && issue.state === 'open');
  const closedIssues = issues.data.filter(issue => !issue.pull_request && issue.state === 'closed');
  const openPRs = pullRequests.data.filter(pr => pr.state === 'open');
  const closedPRs = pullRequests.data.filter(pr => pr.state === 'closed');

  core.info(`Total PRs: ${pullRequests.data.length}`);
  core.info(`Open PRs: ${openPRs.length}`);
  core.info(`Closed PRs: ${closedPRs.length}`);
  core.info(`Total issues: ${issues.data.length}`);
  core.info(`Open issues: ${openIssues.length}`);
  core.info(`Closed issues: ${closedIssues.length}`);

} catch (error) {
  core.setFailed(error.message);
}