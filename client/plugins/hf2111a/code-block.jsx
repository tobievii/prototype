
const React = require('react')
const PropTypes = require('prop-types')
import hljs from 'highlight.js';
//import 'highlight.js/styles/github.css';
import 'highlight.js/styles/vs2015.css';

// import hljs from 'highlight.js/lib/highlight';
// import 'highlight.js/styles/github.css';

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

  render() {
    return (
      <pre>
        <code ref={this.setRef} className={`language-${this.props.language}`}>
          {this.props.value}
        </code>
      </pre>
    )
  }
}


