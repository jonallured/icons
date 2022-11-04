# @artsy/icons

[@artsy/icons](https://github.com/artsy/icons) is the canonical source for icons used at Artsy, serving as an automatic build pipeline for generating JSX representations of .svg sources that can easily be imported into React apps.

To view available icons, see [the docs](https://icons.artsy.net).

## Meta

- **State:** production
- **GitHub:** [https://github.com/artsy/icons](https://github.com/artsy/icons)
- **CI/Deploys:** [CircleCi](https://circleci.com/gh/artsy/force); merged PRs to `artsy/icons#main` are automatically deployed to NPM
- **Docs:** [https://force-storybook.artsy.net](https://force-storybook.artsy.net)
- **Point People:** [@dzucconi](https://github.com/dzucconi)

[![Build Status](https://circleci.com/gh/artsy/icons.svg?style=svg)](https://circleci.com/gh/artsy/icons)

## Installation and Usage

```bash
yarn add @artsy/icons
```

And then later, import icons like so:

```tsx
import { ArtsyLogo } from "@artsy/icons"

const MyApp = () => {
  return <ArtsyLogo />
}
```

## Adding New Icons

We've setup the repo so that adding new icons and publishing to NPM is as automated as can be:

1. Clone the repo: `git clone https://github.com/artsy/icons.git`
1. Create a new branch: `git checkout -b add-new-icon`
1. Copy your new icon `.svg` file into the `src` folder (and follow pre-existing naming conventions! :pray:)
1. Push your branch up to GitHub and open a PR. This should automatically be tagged with a `minor` label indicating a new feature addition
1. Merge PR. This will automatically generate JSX components and publish to NPM, and additionally update the docs
1. Once published, a new comment will be added to the PR announcing the new version.

## Development

```bash
yarn install
yarn build
yarn docs
```
