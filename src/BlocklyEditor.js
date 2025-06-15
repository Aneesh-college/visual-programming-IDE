import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as En from 'blockly/msg/en';
import 'blockly/blocks';

Blockly.setLocale(En);

export default function BlocklyEditor() {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      trashcan: true,
    });
    workspaceRef.current = workspace;

    // Define custom block
    if (!Blockly.Blocks['hello_world']) {
      Blockly.Blocks['hello_world'] = {
        init: function () {
          this.appendDummyInput().appendField('Hello World');
          this.setColour(160);
          this.setTooltip(() => 'Says Hello World');
          this.setHelpUrl('');
        },
      };

      javascriptGenerator.forBlock['hello_world'] = function () {
        return 'console.log("Hello World");\n';
      };
    }

    return () => workspace.dispose();
  }, []);

  const generateCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    alert(code);
  };

  const clearWorkspace = () => {
    workspaceRef.current.clear();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={generateCode}>Generate Code</button>
        <button onClick={clearWorkspace} style={{ marginLeft: '1rem' }}>
          Clear Workspace
        </button>
      </div>
      <div ref={blocklyDiv} style={{ height: '500px', width: '100%' }}></div>

      <xml ref={toolbox} style={{ display: 'none' }}>
        <category name="Logic" colour="210">
          <block type="controls_if"></block>
          <block type="logic_compare"></block>
        </category>
        <category name="Loops" colour="120">
          <block type="controls_repeat_ext"></block>
        </category>
        <category name="Math" colour="230">
          <block type="math_number"></block>
          <block type="math_arithmetic"></block>
        </category>
        <category name="Text" colour="160">
          <block type="text"></block>
          <block type="text_print"></block>
        </category>
        <category name="Custom Blocks" colour="300">
          <block type="hello_world"></block>
        </category>
      </xml>
    </div>
  );
}
