import { YamlHandlerResponse } from 'cdm/MashallModel';
import { getOperatorFilterValue } from 'helpers/Constants';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';
import { DataviewService } from 'services/DataviewService';

export class MarshallFiltersHandler extends AbstractYamlHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;

        if (yaml.filters === undefined || !yaml.filters) {
            yaml.filters = [];
        }
        for (const filter of yaml.filters) {
            if (!DataviewService.getDataviewAPI().value.isTruthy(filter.value)) {
                this.addError(`There was not field key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            if (!DataviewService.getDataviewAPI().value.isTruthy(filter.operator) || getOperatorFilterValue(filter.operator) !== '') {
                this.addError(`There was not operator key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
            if (!DataviewService.getDataviewAPI().value.isTruthy(filter.value)) {
                this.addError(`There was not value key in filter.`);
                yaml.filters.splice(yaml.filters.indexOf(filter), 1);
            }
        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }
}