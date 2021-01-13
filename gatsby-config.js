module.exports = {
    siteMetadata: {
        title: 'Lollypop App'
    },
    plugins: [
        'gatsby-plugin-sass',
        `gatsby-plugin-typescript`,
        `gatsby-plugin-material-ui`,
        'gatsby-plugin-react-helmet',
        // Simple config, passing URL
        {
            resolve: "gatsby-source-graphql",
            options: {
                // Arbitrary name for the remote schema Query type
                typeName: "COLLECT",     //set own choice
                
                // Field under which the remote schema will be accessible. You'll use this in your Gatsby query
                fieldName: "Collect",    //set own choice ( used in 'gatsby-node.js' to get data )
                                
                // Url to query from
                url: "http://localhost:8888/.netlify/functions/graphql_lollypop"
                // url: "https://lollypopapp-ali.netlify.app/.netlify/functions/graphql_lollypop"
            }
        }
    ]
}