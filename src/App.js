import React, {Component} from 'react';
import './App.css';

class App extends Component {
    render() {
        return <AddressBook/>;
    }
};

var AddressBook = React.createClass({
    getInitialState: function() {
        var localStorageContacts = localStorage.getItem('contactList');
        if (localStorageContacts) {
            localStorageContacts = JSON.parse(localStorageContacts);
        } else {
            localStorageContacts = [];
        }
        return {contacts: localStorageContacts, filter: ""};
    },
    render: function() {
        return <div className="container">
            < CreateContact addContact={this.addContact}/>
            <Search changeFilter={this.changeFilter}/>
            <div className="wideContainer">
                < ContactList changeValue={this.changeValue} deleteEntry={this.deleteEntry} contacts={this.filterContacts()}/>
            </div>
        </div>;
    },
    filterContacts: function() {
        return this.state.contacts.filter(function(value) {
            return ((value['name'] || "").indexOf(this.state.filter) >= 0) || ((value['phone'] || "").indexOf(this.state.filter) >= 0) || ((value['email'] || "").indexOf(this.state.filter) >= 0) || ((value['address'] || "").indexOf(this.state.filter) >= 0);
        }.bind(this));
    },
    changeFilter: function(filter) {
        this.setState({filter: filter});
    },
    changeValue: function(field, i, value) {
        this.state.contacts[i][field] = value;
        localStorage.setItem('contactList', JSON.stringify(this.state.contacts));
        this.setState({contacts: this.state.contacts});
    },
    addContact: function(contact) {
        this.state.contacts.unshift(contact);
        localStorage.setItem('contactList', JSON.stringify(this.state.contacts));
        this.setState({contacts: this.state.contacts});
    },
    deleteEntry: function(i) {
        this.state.contacts.splice(i, 1);
        localStorage.setItem('contactList', JSON.stringify(this.state.contacts));
        this.setState({contacts: this.state.contacts});
    }
});

var Search = React.createClass({
    getInitialState: function() {
        return {filter: ""}
    },
    handleChange: function(event) {
        this.setState({filter: event.target.value});
        this.props.changeFilter(event.target.value);
    },
    render: function() {
        return <div>Search<br/><input className="filterinput" type="text" onChange={this.handleChange} value={this.state.filter}/>
        </div>;
    }
});

var Contact = React.createClass({
    getInitialState: function() {
        return {val: ""};
    },
    handleClick: function(p, event) {
        this.props.activateInput(p[0], p[1]);
        this.state.val = this.props.entry[p[0]];
    },
    handleBlur: function() {
        this.props.changeValue(this.state.val);
        this.state.val = "";
        this.props.activateInput("none", -1);
    },
    handleChange(event) {
        this.setState({val: event.target.value});
    },
    handleDelete(event) {
        if (confirm("Are you sure you want to delete this entry?")) {
            this.props.deleteEntry(this.props.id);
        }
    },
    render: function() {
        var entry = {};
        entry['name'] = this.props.entry.name
            ? <div className="contactField" onClick={this.handleClick.bind(this, ["name", this.props.id])}>Name: {this.props.entry.name}
                </div>
            : <div className="greyedout contactField" onClick={this.handleClick.bind(this, ["name", this.props.id])}>Name</div>;

        entry['email'] = this.props.entry.email
            ? < div className = "contactField" onClick = {
                this.handleClick.bind(this, ["email", this.props.id])
            } > Email
            : {
                this.props.entry.email
            } < /div> : <div className="greyedout contactField" onClick={this.handleClick.bind(this, ["email", this.props.id])}>Email</div >;

        entry['phone'] = this.props.entry.phone
            ? < div className = "contactField" onClick = {
                this.handleClick.bind(this, ["phone", this.props.id])
            } > Phone

        Number : {
            this.props.entry.phone
        } < /div> : <div className="greyedout contactField" onClick={this.handleClick.bind(this, ["phone", this.props.id])}>Phone Number</div >;

        entry['address'] = this.props.entry.address
            ? < div className = "contactField" onClick = {
                this.handleClick.bind(this, ["address", this.props.id])
            } > Address
            : {
                this.props.entry.address
            } < /div> : <div className="greyedout contactField" onClick={this.handleClick.bind(this, ["address", this.props.id])}

>Address</div >;

        if (this.props.activeField != "none") {
            entry[this.props.activeField] = <div > <input className="contactEdit" autoFocus onBlur={this.handleBlur} type="text" onChange={this.handleChange} value={this.state.val}/> < /div>; };
            return ( <div className="rel"> <div className="deletebutton" onClick={this.handleDelete} >&#10006;</div > {
                entry['name']
            }
            {
                entry['email']
            }
            {
                entry['phone']
            }
            {
                entry['address']
            } < /div>)
    }
});

var ContactList = React.createClass({
      getInitialState: function() {
          return {
              currentlyEditedField: "none", currentlyEditedEntry: -1
          };
      },
      deleteEntry: function(i) {
          this.props.deleteEntry(i);
      },
      changeValue: function(value) {
          this.props.changeValue(this.state.currentlyEditedField, this.state.currentlyEditedEntry, value);
      },
      activateInput: function(field, entryNumber) {
          this.setState({currentlyEditedField: field, currentlyEditedEntry: entryNumber});
      },
      render: function() {
          return ( < div > {this.props.contacts.map(function(entry, i) { return <Contact deleteEntry={this.deleteEntry} changeValue={this.changeValue} activateInput={this.activateInput} entry={entry} key={i} id={i} activeField={i == this.state.currentlyEditedEntry ? this.state.currentlyEditedField : "none"} / >
    },
    this)
} < /div>)
            }
          });

          var CreateContact = React.createClass({
            getInitialState: function() {
              return {
                showInputForm: false, hideWarning: true
              };
            },
            toggleForm: function() {
            if (this.state.showInputForm) {
                this.setState({ hideWarning: true});
            }
              this.setState({
                showInputForm: !this.state.showInputForm
              });
            },
            addContact: function(contact) {
              this.setState({
                showInputForm: false, hideWarning: true
              });
              this.props.addContact(contact);
            },
            showWarning: function() {
              this.setState({hideWarning: false});
            },
            render: function() {
              return ( < div className="wideContainer" >
              <div className="controlsContainer">
                < input type = "submit"
                value = "Create contact"
                onClick = {
                  this.toggleForm
                }
                className="button"
                / > {
    this.state.showInputForm
        ? < CreateContactForm showWarning = {
            this.showWarning
        }
        addContact = {
            this.addContact
        } />
        : null
} < /div> <div className={this.state.hideWarning ? "hideWarning insufficientInfoProvided" : "insufficientInfoProvided"}>Name plus any other field is required!</div > < /div >
              );
            }
          });

          var CreateContactForm = React.createClass({
            getInitialState: function() {
              return {
                contact: {
                  name: "",
                  phone: "",
                  address: "",
                  email: ""
                }
              };
            },
            render: function() {
              return ( < div id = "createcontactform" >
                < input type = "text"
                placeholder = "Name"
                required="true"
                value = {
                  this.state.contact.name
                }
                onChange = {
                  this.handleChange.bind(this, 'name')
                }
                className="newcontactinput"
                / > <br/ >
    < input type="text" placeholder="Email" value={this.state.contact.email} className="newcontactinput" onChange={this.handleChange.bind(this, 'email')}/>
    <br/ >
        < input type="text" placeholder="Phone Number" value={this.state.contact.phone} className="newcontactinput" onChange={this.handleChange.bind(this, 'phone')}/>
        <br/ >
            < input type="text" placeholder="Address" value={this.state.contact.address} className="newcontactinput" onChange={this.handleChange.bind(this, 'address')}/>
            <br/ >
                < input type="submit" value="Add Contact" onClick={this.addContact} className="button"/>
                < /div >
                    ); }, addContact: function() {if (this.state.contact.name != "" && (this.state.contact.phone != "" || this.state.contact.email != "" || this.state.contact.address != "")) {
                        this.props.addContact(this.state.contact);
                    } else {
                        this.props.showWarning();
                    }
}, handleChange(propertyName, event) {const contact = this.state.contact;
                    contact[propertyName] = event.target.value;
                    this.setState({contact: contact});
                    }
});

export default App;
