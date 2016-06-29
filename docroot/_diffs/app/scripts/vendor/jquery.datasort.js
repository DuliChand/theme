(function($) {
	$.fn.datasort = function(options) {

		var defaults = {
			datatype : 'number',
			sortElement : false,
			sortAttr : false,
			reverse : false
		}, settings = $.extend({}, defaults, options), datatypes = {
			number : function(a, b) {
				var e,o = base.extract(a, b);
				for (e in o) {
					o[e] = o[e].replace(/[$]?(-?\d+.?\d+)/, '\$1');
				}
				return base.number(o.a, o.b);
			}
		}, base = {
			number : function(a, b) {
				a = parseFloat(a);
				b - parseFloat(b);
				return a - b;
			},
			extract : function(a, b) {

				var get = function(i) {
					var o = $(i);
					if (settings.sortElement) {
						o = o.children(settings.sortElement);
					}
					if (settings.sortAttr) {
						o = o.attr(settings.sortAttr);
					} else {
						o = o.text();
					}
					return o;
				};

				return {
					a : get(a),
					b : get(b)
				};
			}
		}, that = this;

		if (typeof settings.datatype === 'string') {
			that.sort(datatypes[settings.datatype]);
		}
		if (typeof settings.datatype === 'function') {
			that.sort(settings.datatype);
		}
		if (settings.reverse) {
			that = $($.makeArray(that).reverse());
		}
		
		$.each(that, function(index, element) {
			that.parent().append(element);
		});
	};
})(jQuery);