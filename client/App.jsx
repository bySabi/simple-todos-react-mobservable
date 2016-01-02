Tasks = new Mongo.Collection("tasks");

var data = mobservable.observable({
  tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
  incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
  currentUser: Meteor.user()
});

/*
var autorunner = Tracker.autorun(function() {
  data(
    Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
    Tasks.find({checked: {$ne: true}}).count(),
    Meteor.user()
  );
});
*/

// App component - represents the whole app
App = mobservableReact.observer(React.createClass({
  getInitialState() {
    return {
      hideCompleted: false,
      text: '',
    }
  },

  componentWillMount() {
    this.data = data;
  },

  renderTasks() {
    // Get tasks from this.data.tasks
    console.log(this.data)
    return this.data.tasks.map((task) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return <Task
        key={task._id}
        task={task}
        showPrivateButton={showPrivateButton} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    Meteor.call("addTask", this.state.text);

    // Clear form
    this.setState({text: ""});
  },

  onTextChange(event) {
    this.setState({text: event.target.value});
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.data.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.data.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit} >
              <input
                type="text"
                placeholder="Type to add new tasks"
                value={this.state.text}
                onChange={this.onTextChange} />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  },

  componentWillUnmount() {
    autorunner.stop();
  }
}));
