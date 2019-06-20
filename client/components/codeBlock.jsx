const React = require('react')
const PropTypes = require('prop-types')
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
export class CodeBlock extends React.PureComponent {
  constructor(props) {
    super(props)
    this.setRef = this.setRef.bind(this)
  }

  setRef(el) {
    this.codeEl = el
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {
    hljs.highlightBlock(this.codeEl)
  }

  view = () => {
    if (this.props.type == undefined) {
      return (
        <pre ref={this.setRef} className={`language-${this.props.language}`}>
          {this.props.value}
        </pre>
      )
    }

    else if (this.props.type == "modify") {
      return (
        <pre style={{ height: "100px" }} ref={this.setRef} className={`language-${this.props.language}`}>
          {this.props.value}
        </pre>
      )
    }
  }

  render() {
    return (<div>
      {this.view()}</div>
    )
  }
}


