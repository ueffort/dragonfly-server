/**
 * Created by tutu on 15-12-30.
 */

class JsonFile {
    public static read(fileName: string): any {
        return require(fileName);
    }
}

export default JsonFile
