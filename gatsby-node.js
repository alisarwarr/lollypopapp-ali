//Use Gatsby's createPages API
exports.createPages = async ({ actions: { createPage }, graphql }) => {

    const res = await graphql(`
        query {
            Collect {
                allLollypop {
                    path
                }
            }
        }
    `)

    const { data } = res;
    console.log(data.Collect.allLollypop);             //returns array of objects having 'path' property

    data.Collect.allLollypop.forEach(({ path }) => {   //destructure that 'path' property
        createPage({
            path: `oneLollypop/${path}`,
            component: require.resolve(`./src/templates/oneLollypop.tsx`),
            context: {
                thatPath: path                         //need to send as by not named of 'path'
            }
        })
    })
}