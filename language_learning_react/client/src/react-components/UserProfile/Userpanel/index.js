import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./tabpanel";
import LearnModule from "./../LearnModule";
import ReviewModule from "./../ReviewModule";
import UserInfor from "./../UserInfo";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SchoolIcon from "@material-ui/icons/School";
import RecommendModel from "./../RecommendModel"
import "./styles.css";

class UserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,    // code from material ui Tab component
    };
  }

  //  use the code from material ui Tab component
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue
    });
    console.log("current value:", this.state.value)
  };
  
  //  use the code from material ui Tab component
  a11yProps = (index) => {
    return {
      id: `wrapped-tab-${index}`,
      "aria-controls": `wrapped-tabpanel-${index}`
    };
  };


  render() {
    const { libraries,profileComponent,appComponent } = this.props;
    console.log("use name:",appComponent.state.user)

    return (
      <div>

        {/* Tab navigation component */}
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          // onClick={this.handleStatus}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab icon={<AccountCircleIcon />} label="Account" {...this.a11yProps(0)} />
          <Tab icon={<SchoolIcon />} label="Learning " {...this.a11yProps(1)} />
          <Tab icon={<SchoolIcon />} label="Review " {...this.a11yProps(2)} />
          <Tab icon={<SchoolIcon />} label="Recommend " {...this.a11yProps(3)} />
        </Tabs>

        {/* first, the user information tab panel, pass "appComponent" from app.js */}
        <TabPanel className="tab_panel" value={this.state.value} index={0}>
          <UserInfor
            appComponent={appComponent}
          />
        </TabPanel>

        {/* then, the learning module tab panel, pass the learning library, this, and profileComponent */}
        <TabPanel className="tab_panel" value={this.state.value} index={1}>
          <LearnModule
            libraries={libraries}
            panelComponent={this}
            profileComponent={profileComponent}
          />
        </TabPanel>

        {/* the review module tab panel, also pass the learning library, this, and profileComponent */}
        <TabPanel className="tab_panel" value={this.state.value} index={2}>
          <ReviewModule
            libraries={libraries}
            panelComponent={this}
            profileComponent={profileComponent}
          />
        </TabPanel>

         {/* last, the recommend tab panel, also pass the learning library and queuecomponet */}
         <TabPanel className="tab_panel" value={this.state.value} index={3}>
          <RecommendModel
           profileComponent={profileComponent}
           panelComponent={this}
          />
        </TabPanel>
      </div>
    );
  }
}
export default UserPanel;
