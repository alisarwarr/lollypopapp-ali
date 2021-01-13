import React from 'react';
import style from './oneLollypop.module.scss';
import classnames from 'classnames';
//COMPONENTS
import Head from '../components/Head';
import Message from '../components/Message';
//SVG-COMPONENT
import Lollypop from '../components/Lollypop';
//MATERIAL-UI
import Typography from '@material-ui/core/Typography';
//REACT-REVEAL
import Zoom from 'react-reveal/Zoom';
//APOLLO-GRAPHQL
import { gql, useQuery } from '@apollo/client';

const GET_LOLLYPOPBYPATH_QUERY = gql`
    query($path: String!) {
        getLollypopbyPath(path: $path) {
            id
            topColor,
            middleColor,
            bottomColor,
            to,
            message,
            from,
            path
        }
    }
`

function oneLollypop({ pageContext: { thatPath } }) {   //grap that path named as 'thatPath' from 'pathCoxtent'
    const { loading, error, data } = useQuery(GET_LOLLYPOPBYPATH_QUERY, {
        variables: {
            path: thatPath                              //used to get particular Lollypop from path
        }
    })

    if(loading) return (
        <>
            <Head
                title="Loading"
            />

            <div className={style.box}>
                <Message
                    sentence="Loading"
                />
            </div>
        </>
    )

    if(error) return (
        <>
            <Head
                title="Error"
            />

            <div className={style.box}>
                <Message
                    sentence="Sorry, Error 404!"
                />
            </div>
        </>
    )

    const { getLollypopbyPath } = data;

    return (
        <div className={style.body}>
            <Head
                title="Lollypop"
            />

            <div className={style.root}>
                <Zoom>
                    <div className={style.lollypop}>
                        <Lollypop
                            topColor={getLollypopbyPath?.topColor}
                            middleColor={getLollypopbyPath?.middleColor}
                            bottomColor={getLollypopbyPath?.bottomColor}
                        />
                    </div>

                    <div className={style.content}>
                        <div className={classnames(style.jumbotron, "jumbotron", "jumbotron-fluid")}>
                            <div className="container">
                                <Typography className={style.link}>
                                    <span> Your lolly is freezing. Share it with this link: </span>
                                    <p> {`https://lollypopapp-ali.netlify.app/${getLollypopbyPath?.path}`} </p>
                                </Typography>

                                <table className="table table-borderless table-dark table-sm">
                                    <tbody>
                                        <tr>
                                            <th className={style.heading}> to </th>
                                            <th className={style.word}> {getLollypopbyPath?.to} </th>
                                        </tr>
                                        <tr>
                                            <th className={style.heading}> message </th>
                                            <th className={style.word}> {getLollypopbyPath?.message} </th>
                                        </tr>
                                        <tr>
                                            <th className={style.heading}> from </th>
                                            <th className={style.word}> {getLollypopbyPath?.from} </th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Zoom>
            </div>
        </div>
    )
}

export default oneLollypop;