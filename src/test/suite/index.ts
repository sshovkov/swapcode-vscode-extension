import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
import { Readable } from 'stream';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		const testFiles = glob.sync('**/**.test.js', { cwd: testsRoot });
		const testFileStream = new Readable({
			objectMode: true,
			read() {},
		});

		testFiles.forEach((file: string) => {
			testFileStream.push(path.resolve(testsRoot, file));
		});
		testFileStream.push(null);

		testFileStream.on('data', (file: string) => {
			mocha.addFile(file);
		});
		testFileStream.on('error', (err: any) => {
			e(err);
		});
		testFileStream.on('end', () => {
			try {
				// Run the mocha test
				mocha.run((failures) => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}
