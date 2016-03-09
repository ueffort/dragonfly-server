/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import Table = require('material-ui/lib/table/table');
import TableHeaderColumn = require('material-ui/lib/table/table-header-column');
import TableRow = require('material-ui/lib/table/table-row');
import TableHeader = require('material-ui/lib/table/table-header');
import TableRowColumn = require('material-ui/lib/table/table-row-column');
import TableBody = require('material-ui/lib/table/table-body');
import Dialog = require('material-ui/lib/dialog');
import Platform from "../../../../app/tools/Platform";


interface ContentProp {
    playbook?: any;
    routerAction?: any;
    id?: number;
    type?: string;
}

class Content extends React.Component<ContentProp, any> {

    constructor(props: any, context: any) {
        super(props);
    }

    render() {
        let dialogOpen = false;
        if(this.props.id) dialogOpen = true;
        let style = {paddingLeft: 300, paddingTop: 64};
        if(Platform.getPlatform().isMobile()){
            style.paddingLeft = 0;
        }
        return (
            <div style={style}>

                <Dialog
                    title="Dialog With Actions"
                    modal={false}
                    open={dialogOpen}
                    onRequestClose={this.__close.bind(this)}
                >
                    The actions in this window were passed in as an array of React objects.
                </Dialog>
                <Table onCellClick={this.__click.bind(this)}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                            <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
                            <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        {this.props.playbook.map( (row: any, index: number) => (
                        <TableRow key={index} selectable={true}>
                            <TableRowColumn>{index}</TableRowColumn>
                            <TableRowColumn>{row.name}</TableRowColumn>
                            <TableRowColumn>{row.status}</TableRowColumn>
                        </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    private __close(){
        this.props.routerAction("/");
    }

    private __click(row: number, cell: number){
        this.props.routerAction("/playbook/"+row);
    }
}

export default Content;