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
import PlaybookFactory from "./PlaybookFactory";
import {playbookData} from "../reducers/PlayBook";


interface ContentProp {
    playbook: playbookData;
    mainAction: any;
    playbookAction: any;
    id?: number;
    type?: string;
}

class Content extends React.Component<ContentProp, any> {

    constructor(props: any, context: any) {
        super(props);
        this.props.playbookAction.list(100, 0);
    }

    render() {
        let dialogOpen = false;
        if(this.props.id) dialogOpen = true;
        if(this.props.type) dialogOpen = true;
        let style = {paddingLeft: 300, paddingTop: 64};
        if(Platform.getPlatform().isMobile()){
            style.paddingLeft = 0;
        }
        return (
            <div style={style}>
                <Dialog
                    modal={false}
                    open={dialogOpen}
                    onRequestClose={this.__close.bind(this)}>
                    <PlaybookFactory
                        type={this.props.type}
                        id={this.props.id}
                        playbook={this.props.playbook}
                        playbookAction={this.props.playbookAction}>
                    </PlaybookFactory>
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
                        {this.props.playbook.topIdList.map( (row: any, index: number) => (
                        <TableRow key={this.props.playbook.map[row].id} selectable={true}>
                            <TableRowColumn>{this.props.playbook.map[row].id}</TableRowColumn>
                            <TableRowColumn>{this.props.playbook.map[row].type}</TableRowColumn>
                            <TableRowColumn>{this.props.playbook.map[row].state}</TableRowColumn>
                        </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    private __close(){
        this.props.mainAction.router("/");
    }

    private __click(row: number, cell: number){
        this.props.mainAction.router("/checkPlaybook/"+this.props.playbook.topIdList[row]);
    }
}

export default Content;