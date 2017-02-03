import './App.css';
import Fields from './Fields';
import Preview from './Preview';
import React, { Component } from 'react';
import RecipientSwitcher from './Recipients';
import dateFns from 'date-fns';
import greeting from './utils/formatGreeting';
import sortBy from 'sort-by';
import { header, phone, recipients, signature } from './defaults';

class App extends Component {
  constructor() {
    super();
    const recipient = recipients[0].id;
    this.state = {
      busy: false,
      status: undefined,
      recipient,
      fields: [
        ...this.personalizeFields(recipient),
        {
          id: 'date',
          value: dateFns.format(new Date(), 'MMMM Do, YYYY'),
          position: 0,
        },
        {
          id: 'body',
          value: '',
          position: 40,
          editable: true,
        },
        {
          id: 'signature',
          value: signature,
          position: 50,
        },
        {
          id: 'subject',
          value: '### Re: ',
          type: 'input',
          position: 20,
          editable: true,
        },
      ]
    };

    this.onChangeField = this.onChangeField.bind(this);
    this.onChangeRecipient = this.onChangeRecipient.bind(this);
    this.submit = this.submit.bind(this);
    this.value = this.value.bind(this);
  }

  personalizeFields(recipient = this.state.recipient) {
    return [
      {
        id: 'header',
        value: [header[recipient].name, header[recipient].address].join('\n'),
        position: 10,
        automatic: true,
      },
      {
        id: 'greeting',
        value: `Dear ${greeting(header[recipient].name)},`,
        type: 'input',
        position: 30,
        automatic: true,
      },
    ]
  }

  onChangeRecipient(e) {
    const { value: recipient } = e.target;
    const nextFields = this.personalizeFields(recipient);

    this.setState({
      recipient,
      fields: this.state.fields.map(field => {
        if (field.automatic) {
          return nextFields.find(nextField => field.id === nextField.id);
        }

        return field;
      }),
    });
  }

  onChangeField(id, e) {
    const { value } = e.target;
    this.setState({
      fields: this.state.fields.map(field => {
        if (field.id === id) {
          return {
            ...field,
            value,
          };
        }

        return field;
      }),
    });
  }

  editableFields() {
    return this.state.fields.sort(sortBy('position')).filter(field => field.editable);
  }

  value() {
    return this.state.fields.sort(sortBy('position')).map(field => field.value).join('\n\n');
  }

  submit(e) {
    e.preventDefault();
    this.setState({ busy: true });
    const value = this.value();
    const to = phone[this.state.recipient];

    window.fetch(process.env.REACT_APP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify({
        value,
        to: '+19999999999',
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.setState({
          busy: false,
          status: `Sent fax ${response.response.id}`,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <RecipientSwitcher
          onChange={this.onChangeRecipient}
          recipients={recipients} 
          checked={this.state.recipient}
        />
        <div className="editor">
          <form onSubmit={this.submit}>
            <Fields 
              fields={this.editableFields()}
              onChange={this.onChangeField}
            />
            <button 
              type="submit"
            >
              Send
            </button>
          </form>
          <Preview value={this.value()} />
        </div>
        {this.state.busy && (
          <h2>Sending</h2>
        )}
        {this.state.status && (
          <div>
            <p>{this.state.status}</p>
            <button type="button" onClick={() => this.setState({ status: undefined })}>Reset</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
