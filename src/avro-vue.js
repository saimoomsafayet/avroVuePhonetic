Vue.component('avro-vue', {
    props: {
        'bangla': {
            type: Boolean,
            default: true
        },
        'value': {
            type: String,
            default: ""
        },
        "mode": {
            type: String,
            default: "input"
        }
    },
    data: function () {
        return {
            isBangla: this.bangla,
            valueText: this.value,
            renderingMode: this.mode
        }
    },
    template: '<textarea v-if="renderingMode == \'textarea\'" v-model="valueText" v-on:keydown="keydown" v-on:focus="focus"></textarea>\
               <input v-else v-model="valueText" v-on:keydown="keydown" v-on:focus="focus">',
    watch: {
        valueText: function(val) {
            this.$emit('update:value', val);
        }
    },
    methods: {
        init: function (options, callback) {

            return this.each(function () {

                if ('bangla' in this) {
                    return;
                }
                this.isBangla = defaults.bangla;
                this.$emit('ready')
            });
        },
        notify: function (e) {
            this.callback(this.isBangla);
        },
        switchKb: function (e, state) {
            if (typeof state === 'undefined') {
                state = !this.databangla;
            }
            this.isBangla = state;
            this.$emit('notify')
        },
        focus: function (e) {
            this.$emit('notify')
        },
        ready: function (e) {
            this.$emit('notify')
        },
        keydown: function (e) {
            var keycode = e.which;
            if (keycode === 77 && e.ctrlKey && !e.altKey && !e.shiftKey) {
                this.switchKb(e, !this.isBangla)
                return false;
            }
            if (!this.isBangla) {
                return;
            }
            if (keycode === 32 || keycode === 13 || keycode === 9) {
                this.replace(e.target);
            }

        },
        replace: function (el) {
            var cur = this.getCaret(el);
            var last = this.findLast(el, cur);
            var bangla = OmicronLab.Avro.Phonetic.parse(this.valueText.substring(last, cur));
            if (document.selection) {
                var range = document.selection.createRange();
                range.moveStart('character', -1 * (Math.abs(cur - last)));
                range.text = bangla;
                range.collapse(true);
            }
            else {
                this.valueText = this.valueText.substring(0, last) + bangla + this.valueText.substring(cur);
                el.selectionStart = el.selectionEnd = (cur - (Math.abs(cur - last) - bangla.length));
            }
        },
        findLast: function (el, cur) {
            var last = cur - 1;
            while (last > 0) {
                var c = this.valueText.charAt(last);
                if (c.trim() === "") {
                    break;
                }
                last--;
            }
            return last;

        },
        getCaret: function (el) {
            if (el.selectionStart) {
                return el.selectionStart;
            } else if (document.selection) {
                el.focus();
                var r = document.selection.createRange();
                if (r === null) {
                    return 0;
                }
                var re = el.createTextRange(),
                    rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);
                return rc.text.length;
            }
            return 0;
        }
    }
})