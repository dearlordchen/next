var React = require('react');
class Hello extends React.Component {
    render() {
        return (
            <h1>Hello {this.props.name}!</h1>
        );
    }
}