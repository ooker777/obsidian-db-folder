import { YamlHandlerResponse } from 'cdm/MashallModel';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';

export class MarshallConfigHandler extends AbstractYamlHandler {
    handlerName: string = 'configuration';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        // check if config is defined. If not, load default
        if (handlerResponse.yaml.config) {
            this.localYaml.config = handlerResponse.yaml.config;
            // if enable_show_state is not defined, load default
            if (handlerResponse.yaml.config.enable_show_state === undefined) {
                this.addError(`There was not enable_debug_mode key in yaml. Default will be loaded`);
                this.localYaml.config.enable_show_state = false;
            }
            // if group_folder_column is not defined, load default
            if (handlerResponse.yaml.config.group_folder_column === undefined) {
                this.addError(`There was not group_folder_column key in yaml. Default will be loaded`);
                this.localYaml.config.group_folder_column = '';
            }
            // if remove_field_when_delete_column is not defined, load default
            if (handlerResponse.yaml.config.remove_field_when_delete_column === undefined) {
                this.addError(`There was not remove_field_when_delete_column key in yaml. Default will be loaded`);
                this.localYaml.config.remove_field_when_delete_column = false;
            }

            // if show_metadata_created is not defined, load default
            if (handlerResponse.yaml.config.show_metadata_created === undefined) {
                this.addError(`There was not show_metadata_created key in yaml. Default will be loaded`);
                this.localYaml.config.show_metadata_created = false;
            }

            // if show_metadata_modified is not defined, load default
            if (handlerResponse.yaml.config.show_metadata_modified === undefined) {
                this.addError(`There was not show_metadata_modified key in yaml. Default will be loaded`);
                this.localYaml.config.show_metadata_modified = false;
            }
        }
        return this.goNext(handlerResponse);
    }
}