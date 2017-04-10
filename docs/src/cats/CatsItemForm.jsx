import React, {Component} from 'react';

class CatsItemForm extends Component {

    constructor(props) {
        super(props);

        // set up initial form state with any values from cat
        const fields = ['name', 'toy'];
        var form = {};
        fields.forEach(field => {
            form[field] = (props.cat && props.cat[field]) || "";
        });
        this.state = {form};

        // bind methods to this class
        this.onChangeField = this.onChangeField.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    onChangeField(field) {
        return (event) => {
            // set the new state of the form
            var form = Object.assign({}, this.state.form);
            form[field] = event.target.value;
            this.setState({form});

            // tell entity editor that the form is now dirty
            // note that you must pass in an object with a boolean property of 'dirty'
            this.props.entityEditor.actions.dirty({dirty: true});
        };
    }

    save() {
        // TODO destructre shit

        // the save action is supplied via the entityEditor prop
        const save = this.props.entityEditor.actions.save;
        // the id is provided by the cat
        // keep in mind that when making a new cat this.props.cat wont exist yet
        const id = this.props.cat ? this.props.cat.id : null;
        // when saving, the data to save should be on a property called payload
        const payload = this.state.form;

        // call the entity editor action, passing in:
        // + the id (which wont exist for new items)
        // + the payload containing the updated dog
        save({id, payload});
    }

    delete() {
        const del = this.props.entityEditor.actions.delete;
        const id = this.props.cat.id;
        del({id});
    }

    render() {
        const {entityEditor} = this.props;
        console.log(entityEditor);

        return <div>
            <div className="InputRow">
                <label htmlFor="name">Name</label>
                <input
                    value={this.state.form.name}
                    onChange={this.onChangeField('name')}
                    id="name"
                />
            </div>
            <div className="InputRow">
                <label htmlFor="toy">Toy</label>
                <input
                    value={this.state.form.toy}
                    onChange={this.onChangeField('toy')}
                    id="toy"
                />
            </div>
            <button className="Button Button-grey" onClick={entityEditor.actions.go.bind(this, {name: "list"})}>Back</button>
            <button className="Button" onClick={this.save} disabled={entityEditor.pending.save}>Save</button>
            {<button className="Button" onClick={this.delete} disabled={!this.props.cat || entityEditor.pending.delete}>Delete</button>}
            {entityEditor.pending.save && <em>Saving...</em>}
            {entityEditor.pending.delete && <em>Deleting...</em>}
            {entityEditor.prompt && entityEditor.prompt.title}
        </div>;
    }
}

// TODO  props validation

export default CatsItemForm;