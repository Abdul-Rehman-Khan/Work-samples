import React, {Component} from "react";
import {Icon} from "antd";
import {connect} from "react-redux";

import notification from "../common/messageBoxes/notification";
import * as topicAction from "../../actions/topicConfigActions";
import PageHeader from "../base_components/PageHeader.jsx";
import {
  MavButton,
  MavTable,
  MavSwitch,
  MavInput,
  MavContent,
  MavScrollbars
} from "../mav/index.jsx";
import {
  selectTopicConfigListValues,
  selectTopicConfigListSlice
} from "../../reducers/topicConfigurationReducer";

class TopicConfiguration extends Component {
  componentDidMount() {
    this.props.fetchTopicConfigList();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.currentlyEditingRowIndex !== null &&
      prevProps.currentlyEditingRowIndex !== this.props.currentlyEditingRowIndex
    ) {
      this.currentlyEditingInputRef.focus();
    }
  }

  currentlyEditingInputRef;

  columns = [
    {
      title: "Name",
      dataIndex: "title",
      width: "33%",
      render: (title, row, index) => {
        return (
          <div>
            {index === this.props.currentlyEditingRowIndex ? (
              <MavInput
                onBlur={this.onTitleBlur}
                bordered={true}
                ref={ref => (this.currentlyEditingInputRef = ref)}
                value={title}
                onChange={e => {
                  this.onTopicTitleChange(e, index);
                }}
              />
            ) : (
              <p onClick={() => this.onTitleClick(index)}>{title}</p>
            )}
          </div>
        );
      }
    },
    {
      title: "Subscriptions",
      width: "33%",
      render: (value, row) => {
        return (
          <div>
            <p
              style={{display: "inline-block", minWidth: "50px"}}
              className="m-r-md"
            >
              {row.androidCount || 0} &nbsp;
              <Icon
                style={{fontSize: "18px", color: "#DBDBDB"}}
                type="android"
              />
            </p>
            <p style={{display: "inline-block", minWidth: "50px"}}>
              {row.iosCount || 0}&nbsp;
              <Icon style={{fontSize: "18px", color: "#DBDBDB"}} type="apple" />
            </p>
          </div>
        );
      }
    },
    {
      title: "Activate",
      dataIndex: "status",
      width: "33%",
      render: (status, row, index) => {
        return (
          <div>
            <span className="m-r text-switch">Off</span>
            <MavSwitch
              checked={status === 1}
              onChange={e => {
                this.onActivationToggle(e, index);
              }}
            />
            <span className="m-l text-switch">On</span>
          </div>
        );
      }
    }
  ];

  onTitleClick = index => {
    if (this.props.topicListValidation.valid) {
      this.props.selectTitleForEdit(index);
    }
  };

  onTitleBlur = e => {
    if (!this.props.topicListValidation.valid) {
      e.preventDefault();
      e.stopPropagation();
      e.target.focus();
      notification(
        "error",
        "Error",
        this.props.topicListValidation.errorMessage
      );
      return;
    }

    this.props.blurTitle();
  };

  onTopicTitleChange = (event, index) => {
    this.props.changeTitle({value: event.target.value, index});
  };

  onActivationToggle(checked, index) {
    this.props.changeActivationStatus({checked, index});
  }

  createTopic() {
    this.props.createTopic();
  }

  onSave = () => {
    this.props
      .createAndUpdateTopics(this.props.topicList)
      .then(res => {
        if (res.status) {
          notification("success", "Topic list updated");
        } else {
          notification(
            "error",
            "Something went wrong",
            "Please try again later"
          );
        }
      })
      .catch(e => {
        console.log(e);
        notification("error", "Something went wrong", "Please try again later");
      });
  };

  onCancel = () => {
    this.props.cancelChanges();
  };

  render() {
    const {
      topicList,
      topicListValidation,
      topicListPending,
      topicSavePending
    } = this.props;
    const {valid} = topicListValidation;
    return (
      <MavContent>
        <PageHeader title="Topic Configuration">
          <div className="m-l-auto">
            <MavButton
              onClick={this.createTopic.bind(this)}
              type="primary"
              size="large"
              shape="round"
              disabled={!valid}
            >
              Add Topic
              <Icon type="plus" />
            </MavButton>
          </div>
        </PageHeader>
        <MavScrollbars>
          <div className="p-a-md">
            <MavTable
              size="large"
              className="m-b-lg"
              columns={this.columns}
              loading={topicListPending}
              dataSource={topicList}
              bordered={false}
              rowKey="id"
              pagination={false}
            />
            <div className="aligned_button">
              <MavButton onClick={this.onCancel} type="default">
                Cancel
              </MavButton>
              <MavButton
                onClick={this.onSave}
                loading={topicSavePending}
                disabled={!valid}
                className="save_button m-l"
                type="primary"
              >
                Save
              </MavButton>
            </div>
          </div>
        </MavScrollbars>
      </MavContent>
    );
  }
}

function mapStateToProps(state) {
  return {
    topicList: selectTopicConfigListValues(state),
    topicListValidation: selectTopicConfigListSlice(state, "validation"),
    topicListPending: selectTopicConfigListSlice(state, "pending"),
    currentlyEditingRowIndex: selectTopicConfigListSlice(
      state,
      "editingRowIndex"
    ),
    topicSavePending: selectTopicConfigListSlice(state, "topicListSave").pending
  };
}

export default connect(
  mapStateToProps,
  {...topicAction}
)(TopicConfiguration);
