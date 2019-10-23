import fs from 'fs';
import args from 'args';
import split from 'split2';
import pump from 'pump';
import { Transform } from 'readable-stream';
import { falconPrettyFactory, CONSTANTS } from '../format';

args
  .option(['c', 'colorize'], 'Force adding color sequences to the output')
  .option(['f', 'crlf'], 'Append CRLF instead of LF to formatted lines')
  .option(['m', 'minimal'], 'Use "minimal"')
  .option(
    ['e', 'errorProps'],
    'Comma separated list of properties on error objects to show (`*` for all properties)',
    ''
  )
  .option(['l', 'levelFirst'], 'Display the log level as the first output field')
  .option(['k', 'errorLikeObjectKeys'], 'Define which keys contain error objects (`-k err,error`)', 'err,error')
  .option('messageKey', 'Highlight the message under the specified key', CONSTANTS.MESSAGE_KEY)
  .option(['a', 'timestampKey'], 'Display the timestamp from the specified key', CONSTANTS.TIMESTAMP_KEY)
  .option(
    ['t', 'translateTime'],
    'Display epoch timestamps as UTC ISO format or according to an optional format string (default ISO 8601)'
  )
  .option(['s', 'search'], 'Specify a search pattern according to jmespath')
  .option(['i', 'ignore'], 'Ignore one or several keys: (`-i time,hostname`)');

args
  .example('cat log | logger-pretty', 'To prettify logs, simply pipe a log file through')
  .example('cat log | logger-pretty --messageKey fooMessage', "To highlight a string at a key other than 'msg', use")
  .example('cat log | logger-pretty -a fooTimestamp', "To display timestamp from a key other than 'time', use")
  .example('cat log | logger-pretty -t', 'To convert Epoch timestamps to ISO timestamps use the -t option')
  .example(
    'cat log | logger-pretty -t "SYS:yyyy-mm-dd HH:MM:ss"',
    'To convert Epoch timestamps to local timezone format use the -t option with "SYS:" prefixed format string'
  )
  .example('cat log | logger-pretty -l', 'To flip level and time/date in standard output use the -l option')
  .example(
    'cat log | logger-pretty -s "msg == \'hello world\'"',
    "Only prints messages with msg equals to 'hello world'"
  )
  .example('cat log | logger-pretty -i pid,hostname', "Prettify logs but don't print pid and hostname");

const opts = args.parse(process.argv);
const pretty = falconPrettyFactory(opts);
const falconPrettyTransport = new Transform({
  objectMode: true,
  transform(chunk, enc, cb) {
    const line = pretty(chunk.toString());
    if (line === undefined) return cb();
    cb(null, line);
  }
});

pump(process.stdin, split(), falconPrettyTransport, process.stdout);

// https://github.com/pinojs/pino/pull/358
if (!process.stdin.isTTY && !fs.fstatSync(process.stdin.fd).isFile()) {
  process.once('SIGINT', function noOp() {});
}
