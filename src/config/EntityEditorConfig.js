/* @flow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import {fromJS, Map} from 'immutable';
import {returnPromise} from '../utils/Utils';

class EntityEditorConfig {

    _config: Map<string, any>;

    constructor(config: Object) {
        this._config = fromJS(config);
    }

    static isEntityEditorConfig(obj: any): boolean {
        return typeof obj == "object" && obj instanceof EntityEditorConfig;
    }

    static validate(obj: any) {
        if(!EntityEditorConfig.isEntityEditorConfig(obj)) {
            throw new Error(`Expected object of type EntityEditorConfig, got ${obj}`);
        }
    }

    get(key: string, notSetValue: any): any {
        return this._config.get(key, notSetValue);
    }


    getIn(searchKeyPath: Array<string>, notSetValue: any): any {
        return this._config.getIn(searchKeyPath, notSetValue);
    }

    merge(nextConfig: Object|EntityEditorConfig|Function): EntityEditorConfig {
        if(typeof nextConfig == "function") {
            nextConfig = nextConfig(this);
        }

        const toMerge: Map<string, any> = EntityEditorConfig.isEntityEditorConfig(nextConfig)
            ? nextConfig._config
            : fromJS(nextConfig);

        // merge configs together
        // only merge Maps, and not workflow
        const mergeFunction: Function = (oldVal: *, newVal: *, key: *): * => {
            const doMerge: boolean = Map.isMap(oldVal)
                && Map.isMap(newVal)
                && key != "workflow";

            return doMerge ? oldVal.mergeWith(mergeFunction, newVal) : newVal;
        };

        const merged: Object = this._config
            .mergeWith(mergeFunction, toMerge)
            .toJS();

        return new EntityEditorConfig(merged);
    }

    data(): Map<string, any> {
        return this._config;
    }

    itemNames(): Object {
        const ucfirst: Function = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const item: string = this._config.getIn(['item', 'single'], 'item');
        const items: string = this._config.getIn(['item', 'plural'], `${item}s`);
        return {
            item,
            items,
            Item: ucfirst(item),
            Items: ucfirst(items)
        };
    }
}

function EntityEditorConfigFactory(config: Object|EntityEditorConfig): EntityEditorConfig {
    if(EntityEditorConfig.isEntityEditorConfig(config)) {
        return config;
    }
    return new EntityEditorConfig(config);
}

// add static methods to factory
EntityEditorConfigFactory.isEntityEditorConfig = EntityEditorConfig.isEntityEditorConfig;
EntityEditorConfigFactory.validate = EntityEditorConfig.validate;

export default EntityEditorConfigFactory;

export {
    EntityEditorConfig
};

