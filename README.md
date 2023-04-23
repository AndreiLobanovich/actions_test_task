# Github action for gathering repository statistics

## Description

Action gathers the following data from designated repository:
1. Total number of PRs
2. Number of open PRs
3. Number of closed PRs
4. Total number of issues
5. Number of opened issues
6. Number of closed issues

## Installation

To set up the action:
1.  [Create PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
2.  [Store PAT in repository secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)
3.  Use your PAT in the workflow by adding
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.YOUR_TOKEN_NAME }}
```

## Variables
owner - Repository owner name (required)
repository - Repository name (required)
monthsAgo - How long ago in months since now shoul statistics be gathered (optional)

## Working on action
To change/add functionality:
1. Edit src/index.js
2. Run 
```sh
ncc build src/index.js
```
3. Replace index.js in root folder with the one generated in dist folder
4. Remove dist folder
