import React from "react";
import "./App.css";
import styles from "./appStyle.js";

import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import {
  TextField,
  CircularProgress,
  Modal,
  Typography,
  Zoom,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: "80"
    };
    this.donateRef = React.createRef();
  }

  componentDidMount() {
    window.gapi.load("client:auth2", this.initClient);
  }

  initClient = () => {
    window.gapi.client
      .init({
        apiKey: process.env.REACT_APP_apiKey,
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4"
        ],
        clientId: process.env.REACT_APP_clientId,
        scope: process.env.REACT_APP_scopes
      })
      .then(() => {
        this.load(this.onLoad);
      });
  };

  onLoad = (data, error) => {
    if (data) {
      const info = data.info;
      let totalSum = Number(0);
      let countryCount = {};
      for (let item of info) {
        totalSum += Number(item.amount);
        countryCount[item.country] = (countryCount[item.country] || 0) + 1;
      }
      let percentage = totalSum / 10;
      this.setState({
        count: info.length,
        info: info,
        totalSum: totalSum,
        percentage,
        topCountries: countryCount
      });
    } else {
      this.setState({ error });
    }
  };

  load = callback => {
    window.gapi.client.load("sheets", "v4", () => {
      window.gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: process.env.REACT_APP_spreadsheetId,
          range: "Sheet1!A1:T"
        })
        .then(
          response => {
            const data = response.result.values;
            const info =
              data.map(res => ({
                amount: res[0],
                country: res[1],
                time: res[2]
              })) || [];
            callback({
              info
            });
          },
          response => {
            callback(false, response.result.error);
          }
        );
    });
  };

  handleChange = e => {
    let amount = e.target.value;
    this.setState({
      amount
    });
  };

  handleSubmit = e => {
    if (this.state.percentage >= 100) return;
    if (isNaN(this.state.amount)) {
      alert("Not a valid input", this.state.amount);
    } else {
      if (!window.gapi.auth2.getAuthInstance().isSignedIn.get())
        window.gapi.auth2
          .getAuthInstance()
          .signIn()
          .then(e => this.update());
      else {
        this.update();
      }
    }
  };

  update = () => {
    let body;
    this.setState({
      processing: true
    });
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(ip => {
        return fetch(`http://ip-api.com/json/${ip.ip}`, {
          Accept: "application/json"
        });
      })
      .then(res => res.json())
      .then(data => {
        let item = [];
        let values = [];
        item.push(this.state.amount, data.country, Date.now().toLocaleString());
        values.push(item);
        body = {
          values: values
        };
      })
      .then(a => {
        window.gapi.client.sheets.spreadsheets.values
          .append({
            spreadsheetId: process.env.REACT_APP_spreadsheetId,
            range: "Sheet1!A1:T",
            valueInputOption: "USER_ENTERED",
            resource: body
          })
          .then(response => {
            this.setState(
              {
                processing: false,
                hasContributed: true
              },
              e => {
                this.load(this.onLoad);
              }
            );
          });
      });
  };

  scroll = () => {
    window.scrollTo(0, this.donateRef.current.offsetTop);
  };
  render() {
    const { classes } = this.props;

    return (
      <div className="App">
        <div className="landingBackground">
          <div className="landingBackgroundProgress">
            <Tooltip
              TransitionComponent={Zoom}
              title={`${Number(this.state.percentage | 0) *
                10}$ raised of 1000$ goal`}
            >
              <LinearProgress
                variant="determinate"
                value={
                  this.state.percentage
                    ? this.state.percentage >= 100 ? 100 : this.state.percentage
                    : 0
                }
                classes={{
                  root: classes.progressBar,
                  barColorPrimary: classes.progressBarInner
                }}
              />
            </Tooltip>
          </div>
          <div className="landingBackgroundMid">
            <div className="landingBackgroundContentHolder">
              <div className="landingBackgroundText" styles="text-align:left">
                Donate to solve the issue of <br />
                <span className="specialText">Water crisis</span> in India
                <br />
                <span className="specialSmallText">
                  Millions of Indians would have no access to drinking water by
                  2020.Donate a small amount to help solve this issue
                </span>
              </div>
              <div className="landingBackgroundAction">
                <Button variant="contained" component="span" size="large">
                  Know More
                </Button>
                <Button
                  variant="contained"
                  component="span"
                  size="large"
                  className={classes.secondButton}
                  onClick={this.scroll}
                >
                  Donate
                </Button>
              </div>
            </div>

            <div className="landingBackgroundImage">
              <img src={require("./weather.svg")} alt="water" />
            </div>
          </div>
        </div>
        {this.state.percentage >= 100 ? (
          <div className="successWrapper">
            <p>
              We have reached our goal!<br />We will no longer be accepting
              donations.<br />
            </p>
          </div>
        ) : (
          <span />
        )}

        <div className="imploreArea">
          {!this.state.hasContributed ? (
            this.state.count ? (
              <div className="imploreTextWrapper">
                Join{" "}
                <span className="specialTextCount">{this.state.count} </span>
                other donors who have already supported this project<br />
                Every dollar helps!
              </div>
            ) : (
              ""
            )
          ) : (
            <div className="thankContribution">
              <img src={require("./thank.svg")} alt="love" />
              <div className="thankContributionText">
                Thank you!<br />
                Your contribution will go a long way!
              </div>
            </div>
          )}

          {this.state.topCountries ? (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <p>
                    <img
                      src={require("./topContributors.svg")}
                      style={{ width: "70px" }}
                      alt="top"
                    />
                    Top Contributors{" "}
                  </p>
                </TableRow>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell align="right">Donors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(this.state.topCountries).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell component="th" scope="row">
                      {row}
                    </TableCell>
                    <TableCell align="right">
                      {this.state.topCountries[row]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <span />
          )}
        </div>

        <div className="donateArea" ref={this.donateRef}>
          <div className="donateAmountWrapper">
            <TextField
              id="filled-adornment-amount"
              variant="filled"
              label="Amount"
              disabled={this.state.percentage >= 100}
              required={true}
              className={classes.donateInput}
              value={this.state.amount}
              defaultValue="0"
              onChange={this.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            />
          </div>

          <div className="donateButtonWrapper">
            <Button
              variant="contained"
              color="primary"
              className={classes.donateButton}
              onClick={this.handleSubmit}
            >
              Donate
            </Button>
          </div>
        </div>

        <div className="authorArea">Made by Daipayan Mukherjee</div>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.processing || false}
        >
          <div className={classes.waitModal}>
            <Typography variant="h6" id="modal-title">
              Please wait while your donation is being processed
            </Typography>
            <CircularProgress
              className={classes.CircularProgress}
              color="secondary"
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(App);
