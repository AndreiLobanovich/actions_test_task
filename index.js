import { Octokit } from 'octokit';
import { core } from '@actions/core';


try {
  const token = process.env.GITHUB_TOKEN;
  const octokit = new Octokit({
    auth: token
  })
  const sinceParam = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const owner = core.getInput("owner");
  const repo = core.getInput("repository");
  const [issues, pullRequests] = await Promise.all([
    octokit.rest.issues.listForRepo({ owner, repo, since: sinceParam }),
    octokit.rest.pulls.list({ owner, repo, state: 'all', sort: 'created', direction: 'desc', since: sinceParam.toISOString() }),
  ]);

  const openIssues = issues.data.filter(issue => !issue.pull_request && issue.state === 'open');
  const closedIssues = issues.data.filter(issue => !issue.pull_request && issue.state === 'closed');
  const openPRs = pullRequests.data.filter(pr => pr.state === 'open');
  const closedPRs = pullRequests.data.filter(pr => pr.state === 'closed');

  console.log(`Total PRs: ${pullRequests.data.length}`);
  console.log(`Open PRs: ${openPRs.length}`);
  console.log(`Closed PRs: ${closedPRs.length}`);
  console.log(`Total issues: ${issues.data.length}`);
  console.log(`Open issues: ${openIssues.length}`);
  console.log(`Closed issues: ${closedIssues.length}`);

} catch (error) {
  core.setFailed(error.message);
}