import { Octokit } from 'octokit';
import { subMonths } from 'date-fns';
import * as core from '@actions/core';
import { State } from './types/enums'

const main = async (): Promise<void> => {
  try {
    const token: string | undefined = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error('Token was not set')
    }

    const octokit = new Octokit({
      auth: token,
    });

    const owner: string = core.getInput('owner');
    const repo: string = core.getInput('repository');
    const dateSince: string = core.getInput('dateSince');
    const sinceParam: Date = dateSince ? new Date(dateSince) : subMonths(new Date(), 1);

    const issuesAndPRs = await octokit.paginate(
      octokit.rest.issues.listForRepo,
      {
        owner: owner,
        repo: repo,
        state: 'all',
        per_page: 100,
      },
    );

    const pullRequests = issuesAndPRs.filter(item => item.pull_request !== undefined);
    const issues = issuesAndPRs.filter(item => item.pull_request === undefined);

    const openIssues = issues.filter(issue => issue.state === State.Open && new Date(issue.created_at) > sinceParam);
    const closedIssues = issues.filter(issue => issue.state === State.Closed && new Date(issue.closed_at as string) > sinceParam);

    const openPRs = pullRequests.filter(pr => pr.state === State.Open && new Date(pr.created_at) > sinceParam);
    const closedPRs = pullRequests.filter(pr => pr.state === State.Closed && new Date(pr.closed_at as string) > sinceParam);

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
    core.setFailed(error instanceof Error ? error.message : "Exception occurred");
  }
}

main();
