import {PluginFunction} from 'vue'

type Options = {
	install: PluginFunction<any>
}

declare const options: Options

export default options