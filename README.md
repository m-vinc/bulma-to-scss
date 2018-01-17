# bulma-to-scss

## Requirement

You need to have Sass (Ruby Sass >=3.4.5) installed. You can install it with

`gem install sass`

## Install

  `npm install bulma-to-scss`

When installing the package, the latest version of bulma will be download and convert into scss

### Meteor

Install bulma-to-scss with the command above.

Install `fourseven:scss` with 

`meteor add fourseven:scss`

And finally import the main scss file.

`@import "{}/node_modules/bulma-to-scss/bulma"`.

If your meteor server is running while installing bulma-to-scss, you need to restart the server, otherwise an error occur.
