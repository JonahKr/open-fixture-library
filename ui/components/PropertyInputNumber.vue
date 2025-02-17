<template>
  <input
    :required="required"
    :min="min"
    :max="max"
    :data-exclusive-minimum="exclusiveMinimum"
    :data-exclusive-maximum="exclusiveMaximum"
    :step="step"
    :placeholder="hint"
    :value="value === `invalid` ? `` : value"
    type="number"
    v-on="lazy ? { change: update } : { input: update }">
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
    minimum: {
      type: [Number, String], // can be the string `invalid`
      required: false,
      default: null,
    },
    maximum: {
      type: [Number, String], // can be the string `invalid`
      required: false,
      default: null,
    },
    value: {
      type: null,
      required: true,
    },
    lazy: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    min() {
      if (this.minimum !== null && this.minimum !== `invalid`) {
        return this.minimum;
      }

      if (`minimum` in this.schemaProperty) {
        return this.schemaProperty.minimum;
      }

      return this.exclusiveMinimum;
    },
    max() {
      if (this.maximum !== null && this.maximum !== `invalid`) {
        return this.maximum;
      }

      if (`maximum` in this.schemaProperty) {
        return this.schemaProperty.maximum;
      }

      return this.exclusiveMaximum;
    },
    exclusiveMinimum() {
      if (`exclusiveMinimum` in this.schemaProperty) {
        return this.schemaProperty.exclusiveMinimum;
      }

      return null;
    },
    exclusiveMaximum() {
      if (`exclusiveMaximum` in this.schemaProperty) {
        return this.schemaProperty.exclusiveMaximum;
      }

      return null;
    },
    step() {
      return this.schemaProperty.type === `integer` ? 1 : `any`;
    },

    /**
     * @public
     * @returns {Record<string, string | null>} Validation data for vue-form
     */
    validationData() {
      return {
        min: this.min === null ? null : `${this.min}`,
        max: this.max === null ? null : `${this.max}`,
        'data-exclusive-minimum': this.exclusiveMinimum === null ? null : `${this.exclusiveMinimum}`,
        'data-exclusive-maximum': this.exclusiveMaximum === null ? null : `${this.exclusiveMaximum}`,
        step: `${this.step}`,
        type: `number`,
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
      const input = this.$el;
      if (input.validity && input.validity.badInput) {
        this.$emit(`input`, `invalid`);
        return;
      }

      if (input.value === ``) {
        this.$emit(`input`, null);
        return;
      }

      let value;
      try {
        value = Number.parseFloat(input.value);
      }
      catch {
        value = `invalid`;
      }

      this.$emit(`input`, value);
    },
  },
};
</script>
