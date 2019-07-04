const styles = {
  progressBar: {
    height: "15px",
    borderRadius: "4px"
  },
  progressBarInner: {
    backgroundColor: "#e5346f"
  },
  donateInput: {
    backgroundColor: "rgba(229,52,111,0.5)",
    padding: "5px 5px 5px 5px",
    color: "black",
    marginBottom: "5%",
    fontWeight: "400"
  },
  donateButton: {
    backgroundColor: "#e5346f",
    fontWeight: "800",
    height: "80px",
    color: "#131212",
    fontSize: "38px",
    letterSpacing: "10px",
    fontFamily: '"Viga", sans-serif',
    "&:hover": {
      backgroundColor: "#131212",
      color: "#e5346f"
    }
  },
  secondButton: {
    backgroundColor: "#e5346f",
    fontWeight: "800",
    color: "#131212",
    "@media screen and (min-width: 283px)": {
      marginLeft: "30px"
    },
    "@media screen and (max-width: 282px)": {
      marginTop: "10px",
      marginLeft: "0"
    }
  },
  paper: {
    position: "absolute",
    width: "50vw",
    maxWidth: "300px",
    backgroundColor: "white",
    padding: "5% 5% 5% 5%",
    "-webkit-box-shadow": "3px 4px 7px 2px #000000",
    boxShadow: " 3px 4px 7px 2px #000000",
    outline: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  table: {
    maxWidth: "400px",
    "@media (max-width: 800px)": {
      textAlign: "left",
      flex: "0 0 100%"
    }
  }
};

export default styles;
