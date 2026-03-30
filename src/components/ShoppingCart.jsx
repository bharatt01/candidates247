import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart as CartIcon, X, CreditCard, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const ShoppingCart = ({ items, onRemove, onCheckout, jiggle }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Drawer>
        <DrawerTrigger asChild>
          <motion.button
            animate={jiggle ? { rotate: [0, -4, 4, -4, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="relative glass-card p-3.5 rounded-full btn-haptic group hover:border-primary/20 transition-all"
            style={{
              boxShadow: items.length > 0 ? "0 4px 24px -4px hsla(239, 84%, 67%, 0.3)" : undefined,
            }}
          >
            <CartIcon size={20} className="text-foreground group-hover:text-primary transition-colors" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center bg-primary text-primary-foreground">
                {items.length}
              </span>
            )}
          </motion.button>
        </DrawerTrigger>
        <DrawerContent className="bg-card border-border">
          <DrawerHeader>
            <DrawerTitle className="text-foreground">Unlock Cart ({items.length})</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Review candidates before unlocking their contact details.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-2 space-y-2 max-h-60 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-muted-foreground hover:text-destructive btn-haptic ml-2 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
          {items.length > 0 && (
            <DrawerFooter>
              <DrawerClose asChild>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onCheckout}
                  className="w-full py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground btn-haptic flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <CreditCard size={15} />
                  Unlock All ({items.length})
                  <ChevronRight size={14} />
                </motion.button>
              </DrawerClose>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ShoppingCart;




