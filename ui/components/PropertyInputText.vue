<template>
  <input
    v-model.trim="localValue"
    :required="required"
    :placeholder="hint"
    :pattern="schemaProperty.pattern"
    :minlength="schemaProperty.minLength"
    :maxlength="schemaProperty.maxLength"
    type="text"
    @input="update()"
    @blur="onBlur()">
</template>

<script>
export default {
  props: {
    schemaProperty: {
      type: Object,
      required: true,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    hint: {
      type: String,
      required: false,
      default: null,
    },
    autoFocus: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: null,
      required: true,
    },
  },
  data() {
    return {
      localValue: this.value ? String(this.value) : ``,
    };
  },
  computed: {
    /**
     * @public
     * @returns {Record<string, string | null>} Validation data for vue-form
     */
    validationData() {
      return {
        pattern: `pattern` in this.schemaProperty ? `${this.schemaProperty.pattern}` : null,
        minlength: `minLength` in this.schemaProperty ? `${this.schemaProperty.minLength}` : null,
        maxlength: `maxLength` in this.schemaProperty ? `${this.schemaProperty.maxLength}` : null,
      };
    },
  },
  mounted() {
    if (this.autoFocus) {
      this.focus();
    }

    this.$watch(`validationData`, function(newValidationData) {
      this.$emit(`vf:validate`, newValidationData);
    }, {
      deep: true,
      immediate: true,
    });
  },
  methods: {
    focus() {
      this.$el.focus();
    },
    update() {
      this.$emit(`input`, this.localValue);
    },
    onBlur() {
      this.$emit(`blur`, this.localValue);
    },
  },
};
</script>
