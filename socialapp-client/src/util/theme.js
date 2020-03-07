export default {
    palette: {
      primary: {
        light: "#5ddef4",
        main: "#00acc1",
        dark: "#007c91",
        contrastText: "#fff"
      },
      secondary: {
        light: "#5ddef4",
        main: "#dc4e00",
        dark: "#007c91",
        contrastText: "#fff"
      }
    },
    spreadThis: {
      card: {
        display:'flex',
        marginBottom: 20,
    },
    cardContent: {
        width: '100%',
        flexDirection: 'column',
        padding:25
    },
    cover:{
        minWidth: 200,
        objectFit: 'cover'
    },
    handle:{
        width:60,
        height:18,
        backgroundColor: "#00acc1",
        marginBottom:7
    },
    date: {
        height:14,
        width:100,
        backgroundColor: "rgba(0,0,0,0.3)",
        marginBottom: 10
    },
    fullLine:{
        height: 15,
        width: '90%',
        marginBottom: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    halfLine:{
        height: 15,
        width: '50%',
        marginBottom: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
      commentImage: {
        maxWidth:'100%',
        height:100,
        objectFit: 'cover',
        borderRadius:'50%',
        marginLeft:8
      },
      commentData: {
        marginLeft: 20
      },
      visibleSeparator: {
        width:'100',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
      },
      profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover',
        marginLeft: 8

      },
      DialogContent: {
        padding: 10
      },
      closeButtonRight: {
        position: 'absolute',
        left: '90%'
      },
      expandButton: {
        position: 'absolute',
        left: '90%'
      },
      spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
      },
      invisibleSeparator:{
        border:'none',
        margin:4
    },
      submitButton : {
        position: 'relative'
    },
    progressSpinner : {
        position: 'absolute'
    },
    closeButton : {
        position:"absolute",
        left: "90",
        top: "6"
    },
      form: {
        textAlign: "center"
      },
      loginImage: {
        margin: "20px auto 20px auto",
        maxWidth: 110
      },
      pageTitle: {
        margin: "10px auto 10px auto"
      },
      textField: {
        margin: "10px auto 10px auto"
      },
      button: {
        marginTop: 20,
        position: "relative"
      },
      customError: {
        color: "red",
        fontSize: "0.8rem",
        marginTop: 10
      },
      progress: {
        position: "absolute"
      },
      invisibleSeparator: {
        border: 'none',
        margin: 4
      },
      visibleSeparator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
      },
      paper: {
        padding: 20
      },
      profile: {
        '& .image-wrapper': {
          textAlign: 'center',
          position: 'relative',
          '& button': {
            position: 'absolute',
            top: '80%',
            left: '70%'
          }
        },
        '& .profile-image': {
          width: 200,
          height: 200,
          objectFit: 'cover',
          maxWidth: '100%',
          borderRadius: '50%'
        },
        '& .profile-details': {
          textAlign: 'center',
          '& span, svg': {
            verticalAlign: 'middle'
          },
          '& a': {
            color: '#00bcd4'
          }
        },
        '& hr': {
          border: 'none',
          margin: '0 0 10px 0'
        },
        '& svg.button': {
          '&:hover': {
            cursor: 'pointer'
          }
        }
      },
      buttons: {
        textAlign: 'center',
        '& a': {
          margin: '20px 10px'
        }
      }
    }
  }