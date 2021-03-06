/* @flow */
/* eslint-disable no-unused-vars */

import React from 'react';
import {fromJS, Map, List} from 'immutable';

import EntityEditorConfig from './EntityEditorConfig';

const NO_HISTORY_ERROR_MESSAGE: string = 'Entity Editor: history prop must be passed to editor when using ReactRouter3Config';
const NO_LOCATION_ERROR_MESSAGE: string = 'Entity Editor: location must be specified in actionProps when using ReactRouter3Config';

const go: Function = ({props}: Object) => ({continueRouteChange, location}: Object): Promiseable => {
    if(continueRouteChange) {
        continueRouteChange();
        return;
    }
    const {history} = props;
    if(!history) {
        throw new Error(NO_HISTORY_ERROR_MESSAGE);
    }
    if(!location) {
        throw new Error(NO_LOCATION_ERROR_MESSAGE);
    }
    history.push(location);
};

function protectRouteChange(entityEditorInstance: Object, config: EntityEditorConfig) {
    const ee: Object = entityEditorInstance;
    const {history, route, routes} = ee.nextProps;

    if(!history) {
        throw new Error(NO_HISTORY_ERROR_MESSAGE);
    }

    ee.unblockRouteChange && ee.unblockRouteChange();

    // create mutable actionProps container so we can pass it into a workflow
    // before we actually have its contents
    var actionProps = {};

    // when react-router is about to change routes, this function will be called
    // so we reject react-router's automatic route transition and instead
    // provide an identical one as an actionProp
    // action at the end of the "go" action / workflow
    ee.unblockRouteChange = history.listenBefore((nextLocation: Object): boolean => {

        // if we're going back in history it would be great to warn against unsaved changes being lost
        // however the current mechanism causes react-router's history to call goBack multiple times.
        // to prevent this bug from surfacing for now, just don't protect against going back
        if(nextLocation.action == "POP") {
            return true;
        }

        // if current task is blocking, that means we're in the middle of an operation
        // and something has tried to change routes
        // we assume this route change was issued by the operation itself
        // and therefore do not block it
        if(ee.isCurrentTaskBlocking(ee.nextProps)) {
            return true;
        }

        // pass nextLocation to continueRouteChange, which returns a thunk
        const continueRouteChange = actionProps.continueRouteChange(nextLocation, nextLocation.action);
        // start the "go" action
        ee.workflowStart("go", config.getIn(["actions", "go"]), {continueRouteChange});
        return false;
    });

    actionProps.continueRouteChange = (nextLocation: Object, action: string) => () => {
        ee.unblockRouteChange();
        switch(action) {
            case "PUSH":
                history.push(nextLocation);
                break;

            case "REPLACE":
            case "POP":
                history.replace(nextLocation);
                break;
        }
        protectRouteChange(entityEditorInstance, config);
    };
}

function unprotectRouteChange(entityEditorInstance: Object) {
    const ee: Object = entityEditorInstance;
    ee.unblockRouteChange && ee.unblockRouteChange();
}

const ReactRouter3Config: EntityEditorConfig = EntityEditorConfig({
    operations: {
        go
    },
    lifecycleMethods: {
        componentWillMount: {
            reactRouter3: protectRouteChange
        },
        componentWillUnmount: {
            reactRouter3: unprotectRouteChange
        }
    }
});

export default ReactRouter3Config;
