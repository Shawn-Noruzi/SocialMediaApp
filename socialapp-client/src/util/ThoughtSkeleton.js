import React, {Fragment} from 'react';
import NoImg from '../images/no-img.png';
import PropTypes from 'prop-types'

//mui

import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'

import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
    ...theme.spreadThis
})

const ThoughtSkeleton = (props) => {
    const { classes } = props;
//more efficient for loop
    const content = Array.from({length: 5}).map((item, index) => (
        <Card className = {classes.card} key={index}>
            <CardMedia className = {classes.cover} image={NoImg}/>
            <CardContent className = {classes.cardContent}>
                <div className={classes.handle}/>
                <div className={classes.date}/>
                <div className={classes.fullLine}/>
                <div className={classes.fullLine}/>
                <div className={classes.halfLine}/>
            </CardContent>
        </Card>

    ))

    return <Fragment>{content}</Fragment>
}

ThoughtSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ThoughtSkeleton)